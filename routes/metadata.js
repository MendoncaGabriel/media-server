const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
const uploadCover = require('../middleware/uploadCover');


router.get('/:name', metadataController.get);
router.post('/register', uploadCover, metadataController.register);

module.exports = router;