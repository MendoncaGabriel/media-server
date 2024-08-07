const express = require('express')
const router = express.Router()
const Metadata = require('../db/models/metadata.schema')
const filmController = require('../controller/film.controller')
const metadataController = require('../controller/metadata.controller')
const adminController = require('../controller/admin.controller')
const uploadImage = require('../middleware/uploadImage.middleware');


router.post('/newMetadata',uploadImage, metadataController.newMetadata);
router.get('/autoSaveFilm', filmController.saveFilm)
router.post('/atualizar-conteudo', uploadImage, metadataController.update);
router.get('/atualizar-conteudo', async (req, res)=>{
    const data = await Metadata.find({}).sort({ name: 1 });


    res.render('updateContentView', {conteudos: data})
});
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