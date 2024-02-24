const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
router.get('/:name', metadataController.get);

module.exports = router;