const SerieSchema = require('../db/models/serie.schema');
const FilmSchema = require('../db/models/film.schema');
const fs = require('fs');
const { promisify } = require('util');
const statAsync = promisify(fs.stat);

//bk2
exports.player = async (req, res) => {
  try {
    const id = req.params.id;
    const type = req.params.type;
    const video = type === 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);
    const movieFile = video.file;
  
    if(!video.file){
      res.status(200).json({msg: 'Erro ao reproduzir este conteudo, desculpe! :('})
      console.log('video.file não foi passado!', video)
      return
    }

    const stats = await statAsync(movieFile);

    const { range } = req.headers;
    const { size } = stats;
    const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
    const end = size - 1;
    const chunkSize = (end - start) + 1;

    res.set({
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4', 
      'Cache-Control': 'public, max-age=3600',
    });


    res.status(206);

    const stream = fs.createReadStream(movieFile, { start, end });
    stream.on('open', () => stream.pipe(res));
    stream.on('error', (streamErr) => res.end(streamErr));
  } catch (err) {
    console.error(err);
    return res.status(404).end('<h1>Movie Not found</h1>');
  }
};
