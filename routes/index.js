const fs = require('fs');
const rangeParser = require('range-parser');
const express = require('express');
const router = express.Router();





router.get('/', async function(req, res) {
  res.status(200).send(':)')
})





module.exports = router;
