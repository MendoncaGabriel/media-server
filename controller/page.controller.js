//### CONTROLLER PAGE ###

//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const cache = require('memory-cache');
const cacheTime = 10 * 60 * 60 * 1 //1h





exports.SeriesPagination = async (req, res) => {
  try {
    const page = req.params.page || 1; 
    const cacheKey = `seriesPageCache_${page}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Pagina com cache')
      res.render('homeView', { seriesPage: cachedData.seriesPage, next: cachedData.next })
    } else {
      console.log('Pagina sem cache')
      const itemsPerPage = 20;
      const skip = (page - 1) * itemsPerPage;

      //TROQUE AQUI O QUE VAI APARECER NA GALERIA DE HOME FILMES OU SERIES
      const seriesPage = await MetadataSchema.find({ type: "serie" }).sort({ _id: -1 }).skip(skip).limit(itemsPerPage);
      const next = seriesPage.length < 20 ? false : true

      if (seriesPage) {
        const saveCache = {seriesPage: seriesPage, next: next }
        cache.put(cacheKey, saveCache, cacheTime );


        res.render('homeView', { seriesPage: seriesPage, next: next });
      } else {
        res.render('homeView', {next: next});
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.FilmesPagination = async (req, res) => {
  try {
    const page = req.params.page || 1; 
    const cacheKey = `filmsPageCache_${page}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Pagina com cache')
      res.render('homeView', { seriesPage: cachedData.seriesPage, next: cachedData.next });

    } else {
      console.log('Pagina sem cache')
      const itemsPerPage = 20; //MAXIMO 20
      const skip = (page - 1) * itemsPerPage;

      //TROQUE AQUI O QUE VAI APARECER NA GALERIA DE HOME FILMES OU SERIES
      const seriesPage = await MetadataSchema.find({ type: "film" }).sort({ _id: -1 }).skip(skip).limit(itemsPerPage);
      const next = seriesPage.length < 20 ? false : true

      if (seriesPage) {
        const saveCache = {seriesPage: seriesPage, next: next }
        cache.put(cacheKey, saveCache, cacheTime ); 

        res.render('homeView', { seriesPage: seriesPage, next: next });
      } else {
        res.render('homeView', {next: next});
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
      const itemsPerPage = 20;
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


