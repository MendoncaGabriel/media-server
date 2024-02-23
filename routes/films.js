const express = require('express');
const router = express.Router();
const filmsControler = require('../controller/filmsController')


router.get('/:name', filmsControler.films);
router.get('/page/:page', filmsControler.pagination);

  
  

module.exports = router;