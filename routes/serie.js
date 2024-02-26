const express = require('express');
const router = express.Router();

const seriesController = require('../controller/seriesController')


//CADASTRAR ARQUIVOS DE SERIE
router.get('/register', seriesController.saveSerie)

//ASSISTIR
router.get('/player/:id', seriesController.play );

//PAGINAÇÃO DE SERIES
router.get('/page/:page', seriesController.page)

//BUSCAR DADOS
router.get('/:id', seriesController.getData)


module.exports = router;
