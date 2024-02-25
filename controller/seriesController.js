const fs = require('fs');
const rangeParser = require('range-parser');
const Serie = require('../db/models/series')


exports.play = async (req, res) => {
  const id = req.params.id;
  const seasonNumber = req.params.se;
  const episodeNumber = req.params.ep;

 
  const pathSerie = await Serie.findById(id);

  if (!pathSerie) {
    return res.status(404).json({ error: 'Série não encontrada.' });
  }

  //buscar temporada
  const season = pathSerie.seasons.find(e => e.seasonNumber == seasonNumber);
  
  //buscar episodio
  const episode = season.episodes.find(e => e.episodeNumber == episodeNumber);
  
  console.log(episode);

  if(!episode){
    return res.status(404).json({ error: 'Episodio não encontrado' });
  }


  try {

    const videoPath = 'videos/' + episode.video 
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

// exports.pagination = async (req, res) => {
//   const page = req.params.page
//   const seriesList = await Serie.distinct('name');
//   const seriesPage = seriesList.slice(page * 10, 40); 
//   res.status(200).json(seriesPage);
// }

// exports.episodesPerSeason = async (req, res) => {
//   const name = req.params.name
//   const season = req.params.season


//   const seriesList = await Serie.find({name: name, season: season});

//   res.status(200).json(seriesList);
// }

// exports.numberOfSeasons = async (req, res) => {
//   const nomeDaSerie = req.params.name;

//   try {
//     const temporadasDistintas = await Serie.distinct('season', { name: nomeDaSerie });

//     const numeroDeTemporadas = temporadasDistintas.length;

//     const resultado = { 'numeroDeTemporadas': numeroDeTemporadas };
//     res.json(resultado);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erro interno do servidor' });
//   }
// };






//NOVA SERIE
exports.saveSerie = async (req, res) => {
  console.log(req.body)
  try{

    const newSerie = new Serie({
      name: req.body.name,
      cover: req.file.filename,
      sinopse: req.body.sinopse,
      episodes: [], 
    })

    await newSerie.save()
  
    console.log('Serie Salva com sucesso!');
    res.status(200).json('serie salva!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar serie' });
  }
}


//PAGINAÇÃO DE SERIES
exports.page = async (req, res) => {
  try {
    const page = parseInt(req.params.page);

    if (isNaN(page)) {
      return res.status(400).json({ msg: "Invalid page number" });
    }

    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    const seriesPage = await Serie.find().skip(skip).limit(itemsPerPage);

    res.status(200).json(seriesPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


//NOVO EPISODIOS
exports.addEpisodeToSerie = async (req, res) => {
  try {
    // ID da série e dados do novo episódio do corpo da requisição
    const { serieId, seasonNumber, episodeNumber, title } = req.body;

    // Encontre a série pelo ID
    const serie = await Serie.findById(serieId);

    if (!serie) {
      return res.status(404).json({ error: 'Série não encontrada.' });
    }

    // Crie um novo episódio
    const newEpisode = {
      episodeNumber,
      title,
      video: req.file.filename,
    };

    // Encontre a temporada correspondente pelo seasonNumber
    const targetSeason = serie.seasons.find((season) => season.seasonNumber === Number(seasonNumber));

    if (!targetSeason) {
      return res.status(404).json({ error: 'Temporada não encontrada.' });
    }

    // Adicione o novo episódio à temporada correspondente
    targetSeason.episodes.push(newEpisode);

    // Salve a série novamente para garantir que as alterações sejam persistidas
    const updatedSerie = await serie.save();

    // Responda com a série atualizada
    res.status(200).json(updatedSerie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


//NOVA TEMPORADA
exports.addSeasonToSerie = async (req, res) => {
  try {
    const { serieId, seasonNumber, title } = req.body;
    console.log(serieId, seasonNumber, title)

    // Encontrar a série pelo ID
    const serie = await Serie.findById(serieId);

    if (!serie) {
      return res.status(404).json({ error: 'Série não encontrada.' });
    }

    // Criar um objeto de temporada
    const newSeason = {
      seasonNumber,
      title,
      episodes: [], 
    };

    // Adicionar a temporada ao array de temporadas da série
    serie.seasons.push(newSeason);

    // Salvar as alterações no banco de dados
    await serie.save();

    res.status(201).json({ message: 'Temporada adicionada com sucesso.', data: newSeason });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};



//ASSISTIR