const express = require('express')
const router = express.Router()

const Metadata = require('../db/models/metadata') 
const seriesController = require('../controller/seriesController')
const metadataController = require('../controller/metadataController')
const filController = require('../controller/filmController')

const uploadImage = require('../middleware/uploadImage');
const checkToken = require('../middleware/checkToken')

router.post('/register',uploadImage, metadataController.register);

router.get('/registrar-conteudo', (req, res)=>{
    res.render('metadataRegister')
})
router.get('/atualizar-conteudo', async (req, res)=>{
    const data = await Metadata.find({})
    res.render('metadataUpdate', {conteudos: data})
})

router.get('/', (req, res)=>{
    res.render('admin')
})

router.get('/autoSaveSerie', seriesController.saveSerie)

router.get('/autoSaveFilm', filController.saveFilm)


router.post('/atualizar-conteudo', uploadImage, metadataController.update);


module.exports = router