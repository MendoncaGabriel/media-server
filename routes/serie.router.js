//### ROTA SERIE ###    
const express = require('express')
const router = express.Router()

//CONTROLLERS
const seriesController = require('../controller/series.controller')

//MIDDLEWARE
const checkToken = require('../middleware/checkToken.middleware')


//BUSCAR DADOS
router.get('/:id', seriesController.seriePage)


module.exports = router;
