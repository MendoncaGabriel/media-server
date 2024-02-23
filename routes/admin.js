const express = require('express')
const router = express.Router()
const Metadata = require('../db/models/metadata')


router.get('/cadastro-metadata', async function(req, res) {
    res.render('registerMetadata')
})

router.get('/cadastro-filme', async function(req, res) {
    const metadataList = await Metadata.find().select('name _id');
    res.render('registerFilm', {metadataList: metadataList})
})

module.exports = router