const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadata.controller')


//MIDDLEWARE
const uploadImage = require('../middleware/uploadImage.middleware');
const checkToken = require('../middleware/checkToken.middleware')


router.get('/:name', checkToken, metadataController.get);

router.post('/newMetadata', uploadImage, metadataController.newMetadata);

router.post('/update', uploadImage, metadataController.update);

router.get('/metadataId/:id', metadataController.getId);


module.exports = router;