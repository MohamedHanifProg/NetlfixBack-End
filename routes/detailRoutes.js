const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/detailcontroller');

// Movie details
router.get('/movie/:id', detailsController.getMovieDetails);

// TV show details
router.get('/tv/:id', detailsController.getTvDetails);

// TV show season 1 episodes
router.get('/tv/:id/season/1', detailsController.getSeasonOneEpisodes);

module.exports = router;
