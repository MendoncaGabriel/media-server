const express = require('express')
const router = express.Router()

const filController = require('../controller/filmController')

//CADASTRAR ARQUIVOS DE SERIE
router.get('/register', filController.saveFilm)

//ASSISTIR
router.get('/player/:id', filController.play );

//PAGINAÇÃO DE SERIES
router.get('/page/:page', filController.page)

//BUSCAR DADOS 
router.get('/:id', filController.getData)


module.exports = router