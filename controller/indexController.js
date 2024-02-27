const Metadata = require('../db/models/metadata')
const Serie = require('../db/models/serie')
const fs = require('fs');
const path = require('path');
const rangeParser = require('range-parser');



exports.indexHome = async (req, res) => {
    
    try {
        const page = 1
        const itemsPerPage = 10;
        const skip = (page - 1) * itemsPerPage;
        
        const seriesPage = await Metadata.find({type: "serie"}).skip(skip).limit(itemsPerPage);
        console.log(seriesPage)
        
        res.render('index', {seriesPage: seriesPage})
        
    } catch (error) {
        
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}


exports.seriePage = async (req, res) => {
    try {
        const id = req.params.id;
    
        // Fetch metadata based on id
        const metadataSerie = await Metadata.findById(id);
        const nameMetadata = metadataSerie.name.toLocaleLowerCase().replace(/'/, '').trim()
    
    
        if (!metadataSerie) {
          return res.status(404).json({ error: 'Metadados não encontrados' });
        }
    
        // Use the actual name directly without JSON.stringify
    
        const episodes = await Serie.find({ name: nameMetadata }).exec();
        const organizedData = episodes.reduce((acc, episode) => {
          const seasonKey = `${episode.season}`;
          acc[seasonKey] = acc[seasonKey] || [];
          acc[seasonKey].push({
             _id: episode._id,
            // type: episode.type,
            // name: episode.name,
            // season: episode.season,
            episode: episode.episode,
            // extension: episode.extension,
            file: episode.file,
            // __v: episode.__v
          });
          return acc;
        }, {});

  

        res.render('pageSerie', {title: metadataSerie.name, season: organizedData})
        // res.json({ metadata: metadataSerie, season: organizedData  });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro do Servidor Interno' });
      }
}


exports.player = async (req, res) =>{
    const id = req.params.id;
    const episode = await Serie.findById(id);
    if(!episode){
      return res.status(404).json({ error: 'Episodio não encontrado' });
    }
  
  
    try {
  
      const videoPath = 'videos/series/' + episode.file 
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