//### ROTA FILM ###    
const express = require('express')
const router = express.Router()

const filmController = require('../controller/film.controller')
router.get('/:id', filmController.filmPage)

module.exports = router