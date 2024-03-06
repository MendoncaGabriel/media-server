const express = require('express')
const router = express.Router()
const seriesController = require('../controller/series.controller')

router.get('/:id', seriesController.seriePage)

module.exports = router;
