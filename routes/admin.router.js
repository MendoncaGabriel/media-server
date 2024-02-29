//### ROTA ADMIN ###    
const express = require('express')
const router = express.Router()

//CONTROLLERS

const filmController = require('../controller/film.controller')
const metadataController = require('../controller/metadata.controller')

const adminController = require('../controller/admin.controller')

//MIDDLEWARE
const uploadImage = require('../middleware/uploadImage.middleware');




//SALVAR METADADOS
router.post('/newMetadata',uploadImage, metadataController.newMetadata);

router.get('/autoSaveFilm', filmController.saveFilm)

router.post('/atualizar-conteudo', uploadImage, metadataController.update);


//BUSCAR CONTEUDO
router.get('/atualizar-dados', adminController.dataRefresh)



//RENDERIZAR PAGINA DE REGISTRO DE METADADOS
router.get('/novo-coteudo', (req, res)=>{
    res.render('newContentView')
})



//RENDERIZAR PAGINA INICIAL ADMIN
router.get('/', (req, res)=>{
    res.render('adminView')
})


module.exports = router