//### ROTA SERIE ###    
const express = require('express')
const router = express.Router()

//CONTROLLERS
const authController = require('../controller/auth.controller')
const filmController = require('../controller/film.controller')
const metadataController = require('../controller/metadata.controller')
const pageController = require('../controller/page.controller')
const scannerController = require('../controller/scanner.controller')
const seriesController = require('../controller/series.controller')

//MIDDLEWARE
const uploadImage = require('../middleware/uploadImage.middleware');
const uploadVideo = require('../middleware/uploadVideo.middleware')
const checkToken = require('../middleware/checkToken.middleware')


//ASSISTIR
router.get('/serie/player/:name/:id',  pageController.player)


//pagina da serie

//BUSCAR DADOS
router.get('/:id', seriesController.seriePage)


module.exports = router;
