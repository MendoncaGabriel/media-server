var express = require('express');
var router = express.Router();
const rangeParser = require('range-parser');
const fs = require('fs');
const path = require('path');


router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/video', (req, res) => {
  const videoPath = 'videos/UFDP.S09E14.mp4';
  const stat = fs.statSync(videoPath); //obter informações estatísticas do arquivo, retorna um objeto fs.Stats, o qual contém informações sobre o arquivo como tamanho, timestamps de modificação, criação, etc.
  const fileSize = stat.size; //está atribuindo o tamanho do arquivo (em bytes) à variável

  const range = req.headers.range || 'bytes=0-';

  const positions = rangeParser(fileSize, range, { combine: true });

  const start = positions[0].start;
  const end = positions[0].end;

  const chunkSize = (end - start) + 1;

  const stream = fs.createReadStream(videoPath, { start, end });

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  });

  stream.pipe(res);
});


module.exports = router;
