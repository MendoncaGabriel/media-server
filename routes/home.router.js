//### ROTA PAGE ###    
const express = require('express')
const router = express.Router()


//MIDDLEWARE
const checkToken = require('../middleware/checkToken.middleware')

//CONTROLLERS
const pageController = require('../controller/page.controller')
router.get('/series', pageController.Series)
router.get('/filmes', pageController.Filmes)
router.get('/', pageController.Series)
module.exports = router