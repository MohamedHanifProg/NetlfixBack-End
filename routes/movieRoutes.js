const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

router.get('/cover', moviesController.getCover);
router.get('/matched', moviesController.getMatched);
router.get('/top10', moviesController.getTop10);
router.get('/love', moviesController.getLove);
router.get('/animation', moviesController.getAnimation);
router.get('/inspiring', moviesController.getInspiring);
router.get('/watchlist', moviesController.getWatchlist);
router.get('/weekend', moviesController.getWeekend);
router.get('/critics', moviesController.getCritics);
router.get('/fresh', moviesController.getFresh);

module.exports = router;
