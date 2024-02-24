const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
const uploadCover = require('../middleware/uploadCover');
const checkToken = require('../middleware/checkToken')



router.post('/update', checkToken, uploadCover, metadataController.update);


router.get('/cadastro-metadata', checkToken, async function(req, res) {
    res.render('registerMetadata')
})
router.get('/update-metadata', checkToken, metadataController.renderUpdate);
router.get('/:name', checkToken, metadataController.get);

router.post('/register', checkToken, uploadCover, metadataController.register);

router.post('/update-metadata-id', checkToken, metadataController.getId);

module.exports = router;