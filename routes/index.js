const express = require('express');
const router = express.Router();
const checkToken = require('../middleware/checkToken')




router.get('/',checkToken, async function(req, res) {
  res.render('index')
})





module.exports = router;
