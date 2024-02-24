const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
const uploadCover = require('../middleware/uploadCover');
const checkToken = require('../middleware/checkToken')


router.get('/cadastro-metadata', checkToken, async function(req, res) {
    res.render('registerMetadata')
})
router.get('/:name', checkToken, metadataController.get);
router.post('/register', checkToken, uploadCover, metadataController.register);

module.exports = router;