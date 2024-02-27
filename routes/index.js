const path = require('path')
const express = require('express')
const router = express.Router()
const indexController = require('../controller/indexController')

router.get('/',  indexController.indexHome)
router.get('/serie/:id',  indexController.seriePage)
router.get('/serie/player/:id',  indexController.player)



router.get('/teste', (req, res) => {
    const filePath = path.join(__dirname, '../public/images/1709044321344.png');
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Erro ao enviar o arquivo: ${err.message}`);
        res.status(404).send('Arquivo não encontrado');
      }
    });
  });






module.exports = router