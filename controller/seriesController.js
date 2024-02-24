const fs = require('fs');
const rangeParser = require('range-parser');
const Serie = require('../db/models/series')

exports.series = async (req, res) => {
  const name = req.params.name
  const season = req.params.season
  const episode = req.params.episode
  console.log(name, season, episode)

  const pathSerie = await Serie.findOne({name: name, season: season, episode: episode  })


  try {

    const videoPath = 'media/series/' + pathSerie.path 
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
  const seriesList = await Serie.distinct('name');
  const seriesPage = seriesList.slice(page * 10, 40); 
  res.status(200).json(seriesPage);
}

exports.episodesPerSeason = async (req, res) => {
  const name = req.params.name
  const season = req.params.season


  const seriesList = await Serie.find({name: name, season: season});

  res.status(200).json(seriesList);
}

exports.numberOfSeasons = async (req, res) => {
  const nomeDaSerie = req.params.name;

  try {
    const temporadasDistintas = await Serie.distinct('season', { name: nomeDaSerie });

    const numeroDeTemporadas = temporadasDistintas.length;

    const resultado = { 'numeroDeTemporadas': numeroDeTemporadas };
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};



exports.register = async (req, res) => {
  try{
    const newSerie = new Serie({
    name: req.body.name,
    path: req.file.filename,
    metadataId: req.body.metadataId,
    season: req.body.season,
    episode: req.body.episode
  })

    newSerie.save()
  
    console.log('Recebido upload de vídeo:', req.file);
    res.status(200).json('serie salva!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar serie' });
  }
}