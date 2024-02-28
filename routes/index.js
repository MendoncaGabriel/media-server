const path = require('path')
const express = require('express')
const router = express.Router()
const indexController = require('../controller/indexController')

router.get('/',  indexController.indexHome)
router.get('/serie/:id',  indexController.seriePage)


router.get('/serie/player/:name/:id',  indexController.player)








module.exports = router