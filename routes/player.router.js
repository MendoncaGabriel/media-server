const express = require('express')
const router = express.Router()
const playerController = require('../controller/player.controller')

router.get('/:type/:id', playerController.player) //usando.

module.exports = router