const express = require('express')
const router = express.Router()
const metadataController = require('../controller/metadataController')
const uploadImage = require('../middleware/uploadImage');
const checkToken = require('../middleware/checkToken')

router.get('/teste', (req, res)=>{
    res.render('teste')
})

router.post('/register',uploadImage, metadataController.register);

router.get('/:name', checkToken, metadataController.get);

router.post('/update', checkToken, uploadImage, metadataController.update);

router.post('/update-metadata-id', checkToken, metadataController.getId);


module.exports = router;