//### CONTROLLER PAGE ###

//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const cache = require('memory-cache');
const cacheTime = 10 * 60 * 60 * 1 //1h


exports.Series = async (req, res) => {
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

      //TROQUE AQUI O QUE VAI APARECER NA GALERIA DE HOME FILMES OU SERIES
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

exports.Filmes = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const cacheKey = `filmsPageCache_${page}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Pagina com cache')
      res.render('homeView', { seriesPage: cachedData });
    } else {
      console.log('Pagina sem cache')
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;

      //TROQUE AQUI O QUE VAI APARECER NA GALERIA DE HOME FILMES OU SERIES
      const seriesPage = await MetadataSchema.find({ type: "film" }).skip(skip).limit(itemsPerPage);

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

exports.Home = async (req, res) => {
  try {
    const page = req.query.page || 1; 
    const cacheKey = `homePageCache_${page}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Pagina com cache')
      res.render('homeView', { seriesPage: cachedData });
    } else {
      console.log('Pagina sem cache')
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;

      //TROQUE AQUI O QUE VAI APARECER NA GALERIA DE HOME FILMES OU SERIES
      const seriesPage = await MetadataSchema.find({ type: "film" }).skip(skip).limit(itemsPerPage);

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


