const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
const uploadImage = require('../middleware/uploadImage');
const checkToken = require('../middleware/checkToken')




router.get('/:name', checkToken, metadataController.get);

router.post('/register', uploadImage, metadataController.register);

router.post('/update', uploadImage, metadataController.update);

router.get('/metadataId/:id', metadataController.getId);


module.exports = router;