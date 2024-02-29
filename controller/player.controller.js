const SerieSchema = require('../db/models/serie.schema');
const FilmSchema = require('../db/models/film.schema');
const fs = require('fs');
const rangeParser = require('range-parser');

exports.player = async (req, res) => {
    const id = req.params.id;
    const type = req.params.type;

    try {
        // Obter informações sobre o vídeo a ser transmitido
        const video = type === 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);
        const videoPath = video.file;
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

        // Obter informações sobre o intervalo de bytes solicitado
        const range = req.headers.range || 'bytes=0-';
        const positions = rangeParser(fileSize, range, { combine: false })[0];
        const start = positions.start;
        const end = positions.end;
        const chunkSize = Math.min(15 * 1024 * 1024, end - start + 1);

        // Configurar cabeçalhos da resposta
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4; codecs="avc1.640028, opus"',
          'Cache-Control': 'public, max-age=3600, no-transform',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Range',
      };
      

        // Enviar cabeçalhos da resposta
        res.writeHead(206, headers);

        // Transmitir o vídeo para o cliente
        const stream = fs.createReadStream(videoPath, { start, end });

        // Adicionar manipulador de eventos para capturar erros no stream
        stream.on('error', (error) => {
            console.error('Erro no stream:', error);
            res.status(500).send('Erro durante a transmissão do vídeo');
        });

        // Adicionar logs de depuração
        console.log(`Recebendo requisição para: ${videoPath}, Range: ${start}-${end}`);

        // Transmitir o vídeo para o cliente
        stream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



// const SerieSchema = require('../db/models/serie.schema')
// const FilmSchema = require('../db/models/film.schema')
// const fs = require('fs')
// const rangeParser = require('range-parser');

// let loadCont = 0
// exports.player = async (req, res) =>{
//     const id = req.params.id;
//     const type = req.params.type
//     loadCont++
//     console.log(loadCont)

//     let video = type == 'film' ?  await FilmSchema.findById(id) : await SerieSchema.findById(id) 

//     try {
//       const videoPath = video.file;
//       const stat = fs.statSync(videoPath);
//       const fileSize = stat.size;
//       const range = req.headers.range || 'bytes=0-';
//       const positions = rangeParser(fileSize, range, { combine: false })[0];
//       const start = positions.start;
//       const end = positions.end;
//       const chunkSize = Math.min(1024 * 1024, end - start + 1);

//       // Configurar cabeçalhos da resposta
//       const headers = {
//         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunkSize,
//         'Content-Type': 'video/mp4',
//         'Cache-Control': 'public, max-age=3600, no-transform', // Ajustado para 1 hora
//       };
  
//       // Enviar cabeçalhos da resposta
//       res.writeHead(206, headers);

//       // Transmitir o vídeo para o cliente
//       const stream = fs.createReadStream(videoPath, { start, end });
//       stream.pipe(res);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
// }




//modelo funcionando!
// const SerieSchema = require('../db/models/serie.schema');
// const fs = require('fs');
// const rangeParser = require('range-parser');
// const ffmpeg = require('fluent-ffmpeg');

// const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
// ffmpeg.setFfmpegPath(ffmpegPath);

// let loadCont = 0;

// exports.player = async (req, res) => {
//   const id = req.params.id;
//   const type = req.params.type;
//   loadCont++;
//   console.log(loadCont);

//   let video;

//   try {
//     // Aqui você deve substituir 'video' pelo nome do seu campo de vídeo em SerieSchema
//     video = type == 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);

//     const videoPath = video.file;

//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;
//     const range = req.headers.range || 'bytes=0-';
//     const positions = rangeParser(fileSize, range, { combine: false })[0];
//     const start = positions.start;
//     const end = positions.end;
//     const chunkSize = Math.min(1024 * 1024, end - start + 1);
//     const stream = fs.createReadStream(videoPath, { start, end });

//     // Configurar cabeçalhos da resposta
//     res.writeHead(206, {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunkSize,
//       'Content-Type': 'video/mp4',
//       'Cache-Control': 'public, max-age=3600, no-transform', // Ajustado para 1 hora
//     });

//     // Transmitir o vídeo para o cliente
//     stream.pipe(res);
//   } catch (error) {
//     console.error('Erro durante o streaming do vídeo:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };




//#########modelo funcional
// const SerieSchema = require('../db/models/serie.schema')
// const FilmSchema = require('../db/models/film.schema')
// const fs = require('fs')
// const rangeParser = require('range-parser');

// let loadCont = 0
// exports.player = async (req, res) =>{
//     const id = req.params.id;
//     const type = req.params.type
//     loadCont++
//     console.log(loadCont)

//     let video = type == 'film' ?  await FilmSchema.findById(id) : await SerieSchema.findById(id) 

//     try {
//       const videoPath = video.file
//       const stat = fs.statSync(videoPath);
//       const fileSize = stat.size;
//       const range = req.headers.range || 'bytes=0-';
//       const positions = rangeParser(fileSize, range, { combine: false })[0];
//       const start = positions.start;
//       const end = positions.end;
//       const chunkSize = Math.min(1024 * 1024, end - start + 1);
//       const stream = fs.createReadStream(videoPath, { start, end });
  
//       res.writeHead(206, {
//         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunkSize,
//         'Content-Type': 'video/mp4',
//         'Cache-Control': 'public, max-age=3600, no-transform', // Ajustado para 1 hora
//       });
  
//       stream.pipe(res);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
// }
