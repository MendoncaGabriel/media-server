const express = require('express')
const router  = express.Router()
const searchController = require('../controller/search.controller')

router.get('/:arguments', searchController.searchItem) //usando.

module.exports = router