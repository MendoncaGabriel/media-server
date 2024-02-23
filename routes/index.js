const fs = require('fs');
const rangeParser = require('range-parser');
const express = require('express');
const router = express.Router();
const Film = require('../db/models/films')
const Serie = require('../db/models/series')

router.get('/', async function(req, res, next) {
  const Films = await Film.find();
  const first20Films = Films.slice(0, 20);

  res.status(200).json(first20Films);
});


router.get('/:page', async function(req, res, next) {
  const page = req.params.page
  const Films = await Film.find();
  const next20Films = Films.slice(page * 10, 40); 
  res.status(200).json(next20Films);
});






module.exports = router;
