const SerieSchema = require('../db/models/serie.schema');
const FilmSchema = require('../db/models/film.schema');
const fs = require('fs');
const cache = require('memory-cache');
const cacheTime = 60 * 60 * 24 *2 //2 dias

async function getVideo(id, type) {
  try{
    const cacheKey = `${type}-${id}`;
    const cachedVideo = cache.get(cacheKey);
  
    if (cachedVideo) {
      return cachedVideo;
    } else {

      const video = type === 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);
  
      if (!video.file) {
        return null; // Tratar caso o arquivo não exista
      }
  
      cache.put(cacheKey, video, cacheTime);
      return video;
    }
  }catch(erro){
    console.log('Erro: player.contoller.js - grtVideo()', erro)
  }
}

//Este controller e mais rapido e otimizado, inicia o video mais rapido e carrega a troca mais rapida, suporta varias paginas ao mesmo tempo
exports.player = async (req, res) => {
  try{
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }

    //buscar arquivo
    const id = req.params.id;
    const type = req.params.type;
    const video = await getVideo(id, type);
    const movieFile = video.file;
    // const video = type === 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);

    if(!video.file){
      res.status(200).json({msg: 'Erro ao reproduzir este conteudo, desculpe! :('})
      console.log('video.file não foi passado!', video)
      return
    }

    // get video stats (about 61MB)
    const videoPath = movieFile;
    const videoSize = fs.statSync(movieFile).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 2 * 10 ** 6; // 2 MB, por exemplo
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
      "Cache-Control": "public, max-age=31536000", // Exemplo de cabeçalho de cache
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }catch(erro){
    console.error('Erro ao executar o código principal:', error);
    res.status(500).send('Erro interno do servidor');
  }
}


// //bk2
// exports.player = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const type = req.params.type;
//     const video = type === 'film' ? await FilmSchema.findById(id) : await SerieSchema.findById(id);
//     const movieFile = video.file;
  
//     if(!video.file){
//       res.status(200).json({msg: 'Erro ao reproduzir este conteudo, desculpe! :('})
//       console.log('video.file não foi passado!', video)
//       return
//     }

//     const stats = await statAsync(movieFile);

//     const { range } = req.headers;
//     const { size } = stats;
//     const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
//     const end = size - 1;
//     const chunkSize = (end - start) + 1;

//     res.set({
//       'Content-Range': `bytes ${start}-${end}/${size}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunkSize,
//       'Content-Type': 'video/mp4', 
//       'Cache-Control': 'public, max-age=3600',
//     });


//     res.status(206);

//     const stream = fs.createReadStream(movieFile, { start, end });
//     stream.on('open', () => stream.pipe(res));
//     stream.on('error', (streamErr) => res.end(streamErr));
//   } catch (err) {
//     console.error(err);
//     return res.status(404).end('<h1>Movie Not found</h1>');
//   }
// };
