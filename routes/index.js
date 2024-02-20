var express = require('express');
var router = express.Router();
const range = require('range-parser');
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Rota principal, você pode renderizar sua página HTML aqui se necessário
  res.render('index', { title: 'Express', src:'UFDP.S09E14.mp4' });
});



module.exports = router;
