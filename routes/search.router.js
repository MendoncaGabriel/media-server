const express = require('express')
const router  = express.Router()
const searchController = require('../controller/search.controller')

router.get('/:arguments', searchController.searchItem)
// router.post('/', searchController.search)


module.exports = router