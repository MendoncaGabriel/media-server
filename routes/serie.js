const express = require('express');
const router = express.Router();

const seriesController = require('../controller/seriesController')



router.get('/:name/season/:season/episode/:episode', seriesController.series );
router.get('/page/:page', seriesController.pagination);

router.get('/:name/season/:season', seriesController.episodesPerSeason); //episodios por temporada
router.get('/:name/season', seriesController.numberOfSeasons); //quantas temporadas

module.exports = router;


