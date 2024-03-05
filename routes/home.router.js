//### ROTA PAGE ###    
const express = require('express')
const router = express.Router()


//MIDDLEWARE
const checkToken = require('../middleware/checkToken.middleware')

//CONTROLLERS
const pageController = require('../controller/page.controller')
router.get('/series', pageController.SeriesPagination)
router.get('/series/page/:page', pageController.SeriesPagination)

router.get('/filmes', pageController.FilmesPagination)
router.get('/filmes/page/:page', pageController.FilmesPagination)

router.get('/', pageController.FilmesPagination)
module.exports = router