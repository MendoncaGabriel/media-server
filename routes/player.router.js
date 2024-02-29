//### ROTA ADMIN ###    
const express = require('express')
const router = express.Router()

//CONTROLLERS
const playerController = require('../controller/player.controller')

//MIDDLEWARE

const checkToken = require('../middleware/checkToken.middleware')
router.get('/:type/:id', playerController.player)

module.exports = router