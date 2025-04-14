const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');

router.get('/cover', homepageController.getCover);
router.get('/matched', homepageController.getMatched);
router.get('/netflix', homepageController.getNetflix);
router.get('/top10', homepageController.getTop10);
router.get('/love', homepageController.getLove);
router.get('/animation', homepageController.getAnimation);
router.get('/inspiring', homepageController.getInspiring);
router.get('/watchlist', homepageController.getWatchlist);
router.get('/weekend', homepageController.getWeekend);
router.get('/critics', homepageController.getCritics);
router.get('/fresh', homepageController.getFresh);
router.get('/adultAnimation', homepageController.getAdultAnimation);

module.exports = router;
