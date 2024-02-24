const express = require('express');
const router = express.Router();
const seriesController = require('../controller/seriesController')
const uploadSeries = require('../middleware/uploadSerie')
const Metadata = require('../db/models/metadata')
const checkToken = require('../middleware/checkToken')

router.get('/cadastro-serie', checkToken, async function(req, res) {
    const metadataList = await Metadata.find().select('name _id');
    res.render('registerSerie', {metadataList: metadataList})
})

router.post('/register', uploadSeries, seriesController.register);

router.get('/page/:page',checkToken, seriesController.pagination);
router.get('/:name/season',checkToken, seriesController.numberOfSeasons); //quantas temporadas
router.get('/:name/season/:season',checkToken, seriesController.episodesPerSeason); //episodios por temporada
router.get('/:name/season/:season/episode/:episode',checkToken, seriesController.series );


module.exports = router;


