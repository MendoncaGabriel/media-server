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






//PEGAR INFORMAÇÕES DA SERIE
exports.seriePage = async (req, res) => {
  try {
    const id = req.params.id;
    const metadataSerie = await MetadataSchema.findById(id);
    if (!metadataSerie) {
      return res.status(404).json({ error: 'Metadados não encontrados' });
    }

    const episodes = await SerieSchema.find({ name: metadataSerie.name }).exec();

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
  
    res.render('pageView', { metadataSerie: metadataSerie, season: organizedData, nameMetadata: metadataSerie.name })

  } catch (error) {
    res.status(500).json({ msg: 'Erro do Servidor Interno', error });
  }
}