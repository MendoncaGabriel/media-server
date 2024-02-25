const express = require('express');
const router = express.Router();
const Serie = require('../db/models/series')

const seriesController = require('../controller/seriesController')

const uploadImage = require('../middleware/uploadImage')
const uploadVideo = require('../middleware/uploadVideo')



//NOVO EPISODIO
router.post('/newEpisode', uploadVideo, seriesController.addEpisodeToSerie ) //serieId, seasonNumber, episodeNumber, title, path

//NOVA SERIE
router.post('/newSerie', uploadImage, seriesController.saveSerie ) // name, sinopse, cover

//NOVA TEMPORADA
router.post('/newSeason', seriesController.addSeasonToSerie ) // name, sinopse, cover


//CADASTRO DE SERIE - FRONT 
router.get('/newSerie', async (req, res) =>{
    res.render('newSerie')
});


//CADASTRO DE EPISODIO - FRONT
router.get('/newEpisode/:id', async (req, res) =>{ //id da serie
    const id = req.params.id
    const data = await Serie.findById(id)
    console.log(data)

    if(!data.seasons || data.seasons.length == 0){
        return res.status(404).json({msg: "Sem temporadas, por favor cadastre uma temporada para esta serie"})
    }
    
    res.render('newEpisode', {seasonList: data.seasons, serieId: data._id, name: data.name})
});


//CADASTRO DE TEMPORADA - FRONT
router.get('/newSeason', async (req, res) =>{
    const data = await Serie.find({})
    res.render('newSeason', {serieList: data})
});




//ASSISTIR
router.get('/:id/:se/:ep', seriesController.play );

//PAGINAÇÃO DE SERIES
router.get('/page/:page', seriesController.page)



// router.get('/page/:page',checkToken, seriesController.pagination);
// router.get('/:name/season',checkToken, seriesController.numberOfSeasons); //quantas temporadas
// router.get('/:name/season/:season',checkToken, seriesController.episodesPerSeason); //episodios por temporada

// router.get('/cadastro-serie', checkToken, async function(req, res) {
//     const metadataList = await Metadata.find().select('name _id');
//     res.render('registerSerie', {metadataList: metadataList})
// })

module.exports = router;


