const express = require('express');
const router = express.Router();
const filmsControler = require('../controller/filmsController')
const uploadFilm = require('../middleware/uploadFilm')
const checkToken = require('../middleware/checkToken')
const Metadata = require('../db/models/metadata')




router.get('/cadastro-filme',checkToken, async function(req, res) {
    const metadataList = await Metadata.find().select('name _id');
    res.render('registerFilm', {metadataList: metadataList})
})

router.post('/register',checkToken, uploadFilm, filmsControler.register);
router.get('/page/:page',checkToken, filmsControler.pagination);


router.get('/:name',checkToken, filmsControler.films);
  

module.exports = router;