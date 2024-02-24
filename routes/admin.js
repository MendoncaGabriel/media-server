const express = require('express')
const router = express.Router()
const Metadata = require('../db/models/metadata')





//Front End
router.get('/cadastro-metadata', async function(req, res) {
    res.render('registerMetadata')
})

router.get('/cadastro-serie', async function(req, res) {
    const metadataList = await Metadata.find().select('name _id');
    res.render('registerSerie', {metadataList: metadataList})
})

router.get('/cadastro-filme', async function(req, res) {
    const metadataList = await Metadata.find().select('name _id');
    res.render('registerFilm', {metadataList: metadataList})
})

module.exports = router