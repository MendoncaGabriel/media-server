const express = require('express')
const router = express.Router()

router.get('/cadastro-metadata', async function(req, res) {
    res.render('registerMetadata')
})

router.get('/cadastro-filme', async function(req, res) {
    res.render('registerFilm')
})

module.exports = router