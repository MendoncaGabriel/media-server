const express = require('express');
const router = express.Router();
const filmsControler = require('../controller/filmsController')
const uploadFilm = require('../middleware/uploadFilm')

router.post('/register', uploadFilm, filmsControler.register);
router.get('/:name', filmsControler.films);
router.get('/page/:page', filmsControler.pagination);

  
  

module.exports = router;