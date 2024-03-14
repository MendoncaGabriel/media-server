const MetadataSchema = require('../db/models/metadata.schema');
const cache = require('memory-cache');
const cacheTime = 60 * 60 * 24 * 2; // 2 dias
const itemsPerPage = 20;

const renderHomeView = (res, seriesPage, next) => {
  res.render('homeView', { seriesPage, next });
};

const getPaginationData = async (page, type) => {
  const skip = (page - 1) * itemsPerPage;
  //ordenar do ultimo adicionado para primeiro adicionado
  const seriesPage = await MetadataSchema.find({ type }).sort({ _id: -1 }).skip(skip).limit(itemsPerPage);


  //ORDENA DA MAIOR AVALIAÇÃO PARA A MENOR
  //const seriesPage = await MetadataSchema.find({ type }).sort({ rating: -1 }).skip(skip).limit(itemsPerPage);

  const next = seriesPage.length < itemsPerPage ? false : true;
  return { seriesPage, next };
};

const getAndCacheData = async (req, res, page, cacheKey, type) => {
  try {
    const { seriesPage, next } = await getPaginationData(page, type);
    const saveCache = { seriesPage, next };
    cache.put(cacheKey, saveCache, cacheTime);
    renderHomeView(res, seriesPage, next);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.SeriesPagination = async (req, res) => {
  const page = req.params.page || 1;
  const cacheKey = `seriesPageCache_${page}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    renderHomeView(res, cachedData.seriesPage, cachedData.next);
  } else {
    await getAndCacheData(req, res, page, cacheKey, "serie");
  }
};

exports.FilmesPagination = async (req, res) => {
  const page = req.params.page || 1;
  const cacheKey = `filmsPageCache_${page}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    renderHomeView(res, cachedData.seriesPage, cachedData.next);
  } else {
    await getAndCacheData(req, res, page, cacheKey, "film");
  }
};

// exports.Home = async (req, res) => {
//   const page = req.query.page || 1;
//   const cacheKey = `homePageCache_${page}`;
//   const cachedData = cache.get(cacheKey);

//   if (cachedData) {
//     renderHomeView(res, cachedData);
//   } else {
//     try {
//       const seriesPage = await MetadataSchema.find({ type: "film" }).skip((page - 1) * itemsPerPage).limit(itemsPerPage);
      
//       if (seriesPage) {
//         cache.put(cacheKey, seriesPage, cacheTime);
//         renderHomeView(res, seriesPage);
//       } else {
//         res.render('homeView');
//       }
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// };
