const fs = require('fs');
const rangeParser = require('range-parser');
const Film = require('../db/models/films')


exports.films = async (req, res) => {
  const name = req.params.name
  const pathFilm = await Film.findOne({name: name })
  
  try {

    const videoPath = 'media/films/' + pathFilm.path 
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
}


exports.pagination = async (req, res) => {
  const page = req.params.page
  const filmsList = await Film.find();
  const filmsPage = filmsList.slice(page * 10, 40); 
  res.status(200).json(filmsPage);
}

exports.register = async (req, res) => {
  try{
    console.log('Recebido upload de vídeo:', req.file);
    res.status(200).json('filme salvo!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar filme' });
  }
}
