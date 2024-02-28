//### CONTROLLER SERIE ###


//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const SerieSchema = require('../db/models/serie.schema')
const FilmSchema = require('../db/models/film.schema')
const UserSchema = require('../db/models/user.schema')

const fs = require('fs');
const path = require('path');
const rangeParser = require('range-parser');
//--------------------------------------------------------------------


//ASSISTIR
// exports.play = async (req, res) => {
//   const id = req.params.id;
//   const episode = await Serie.findById(id);
//   if(!episode){
//     return res.status(404).json({ error: 'Episodio não encontrado' });
//   }


//   try {

//     // const videoPath = 'videos/series/' + episode.file 
//     const videoPath = path.join('D:', 'midia-server', 'series', episode.file);
//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;

//     const range = req.headers.range || 'bytes=0-';
//     const positions = rangeParser(fileSize, range, { combine: false })[0];
//     const start = positions.start;
//     const end = positions.end;

//     const chunkSize = Math.min(1024 * 1024, end - start + 1);

//     const stream = fs.createReadStream(videoPath, { start, end });

//     res.writeHead(206, {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunkSize,
//       'Content-Type': 'video/mp4',
//       'Cache-Control': 'public, max-age=3600', // Ajustado para 1 hora
//     });

//     stream.pipe(res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// }

//PAGINAÇÃO DE SERIES
// exports.page = async (req, res) => {
//   try {
//     const page = parseInt(req.params.page);

//     if (isNaN(page)) {
//       return res.status(400).json({ msg: "Invalid page number" });
//     }

//     const itemsPerPage = 10;
//     const skip = (page - 1) * itemsPerPage;

//     const seriesPage = await Metadata.find({type: "serie"}).skip(skip).limit(itemsPerPage);

//     res.status(200).json(seriesPage);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



//PEGAR INFORMAÇÕES DA SERIE
// exports.getData = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Fetch metadata based on id
//     const metadataSerie = await Metadata.findById(id);
//     const nameMetadata = metadataSerie.name.toLocaleLowerCase().replace(/'/, '').replace(/:/, '').trim()


//     if (!metadataSerie) {
//       return res.status(404).json({ error: 'Metadados não encontrados' });
//     }

//     // Use the actual name directly without JSON.stringify

//     const episodes = await Serie.find({ name: nameMetadata }).exec();
//     const organizedData = episodes.reduce((acc, episode) => {
//       const seasonKey = `${episode.season}`;
//       acc[seasonKey] = acc[seasonKey] || [];
//       acc[seasonKey].push({
//          _id: episode._id,
//         // type: episode.type,
//         // name: episode.name,
//         // season: episode.season,
//         episode: episode.episode,
//         // extension: episode.extension,
//         file: episode.file,
//         // __v: episode.__v
//       });
//       return acc;
//     }, {});

//     res.json({ metadata: metadataSerie, season: organizedData  });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Erro do Servidor Interno' });
//   }
// };