//### CONTROLLER PAGE ###


//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const SerieSchema = require('../db/models/serie.schema')
const FilmSchema = require('../db/models/film.schema')
const UserSchema = require('../db/models/user.schema')

const fs = require('fs');
const path = require('path');
const rangeParser = require('range-parser');
const cache = require('memory-cache');


//--------------------------------------------------------------------




const cacheTime = 10 * 60 * 60 * 1 //1h




exports.Home = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const cacheKey = `seriesPageCache_${page}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Pagina com cache')
      res.render('homeView', { seriesPage: cachedData });
    } else {
      console.log('Pagina sem cache')
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;

      const seriesPage = await MetadataSchema.find({ type: "serie" }).skip(skip).limit(itemsPerPage);

      if (seriesPage) {
        cache.put(cacheKey, seriesPage, cacheTime ); 

        res.render('homeView', { seriesPage: seriesPage });
      } else {
        res.render('homeView');
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};





exports.player = async (req, res) =>{
  const id = req.params.id;
  const nameFolder = req.params.name.replace(/ /g, '-')  

  const episode = await SerieSchema.findById(id);
  if(!episode){
    return res.status(404).json({ error: 'Episodio não encontrado' });
  }

  try {

    const videoPath = episode.file
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