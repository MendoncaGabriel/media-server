const fs = require('fs');
const rangeParser = require('range-parser');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

const Film = require('../db/models/films')


//filmes
router.get('/:name', async (req, res) => {
  const name = req.params.name
  const pathFilm = await Film.findOne({name: name })
 

  try {

    const videoPath = 'videos/' + pathFilm.path + '.' + pathFilm.format
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const range = req.headers.range || 'bytes=0-';
    const positions = rangeParser(fileSize, range, { combine: false })[0];
    const start = positions.start;
    const end = positions.end;

    const chunkSize = Math.min(1024 * 1024, end - start + 1);

    const stream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'public, max-age=3600', // Ajustado para 1 hora
    });

    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
