const SerieSchema = require('../db/models/serie.schema');
const FilmSchema = require('../db/models/film.schema');
const fs = require('fs');


const { promisify } = require('util');
const statAsync = promisify(fs.stat);

exports.player = async (req, res) => {
  const id = req.params.id;
  const type = req.params.type;
  const video = type === 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);
  const movieFile = video.file;

  try {
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
      'Content-Type': 'video/webm',  // Ajuste conforme o formato do seu vídeo
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


//BACKUP
// exports.player = async (req, res) => {
//   const id = req.params.id;
//   const type = req.params.type;
//   let video = type == 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);
//   const movieFile = video.file
//   console.log(movieFile)

//   fs.stat(movieFile, (err, stats) => {
//     if (err) {
//       console.log(err);
//       return res.status(404).end('<h1>Movie Not found</h1>');
//     }

//     // Variáveis necessárias para montar o chunk header corretamente
//     const { range } = req.headers;
//     const { size } = stats;
//     const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
//     const end = size - 1;
//     const chunkSize = (end - start) + 1;

//     // Definindo headers de chunk
//     res.set({
//       'Content-Range': `bytes ${start}-${end}/${size}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunkSize,
//       'Content-Type': 'video/WebM',
//     });

//     // É importante usar status 206 - Partial Content para o streaming funcionar
//     res.status(206);

//     // Utilizando ReadStream do Node.js
//     // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
//     const stream = fs.createReadStream(movieFile, { start, end });
//     stream.on('open', () => stream.pipe(res));
//     stream.on('error', (streamErr) => res.end(streamErr));
//   });
// }


