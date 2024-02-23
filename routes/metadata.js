//rota
const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
const uploadCover = require('../middleware/uploadCover');

router.post('/register', uploadCover, metadataController.register);


router.get('/:name', metadataController.get);




module.exports = router;
