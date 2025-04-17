const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');
const { protect } = require('../middlewares/authMiddleware');



router.get('/cover', homepageController.getCover);
router.get('/matched', protect, homepageController.getMatched);
router.get('/netflix', homepageController.getNetflix);
router.get('/top10', homepageController.getTop10);
router.get('/recent',  protect, homepageController.getRecent);
router.get('/popular', protect, homepageController.getPopular); 
router.get('/animation', homepageController.getAnimation);
router.get('/inspiring', homepageController.getInspiring);
router.get('/mylistrecent', protect, homepageController.getMyListRecent);
router.get('/watchlist', homepageController.getWatchlist);
router.get('/weekend', homepageController.getWeekend);
router.get('/critics', homepageController.getCritics);
router.get('/fresh', homepageController.getFresh);
router.get('/adultAnimation', homepageController.getAdultAnimation);
router.get('/proxy', homepageController.getProxyDetails);


module.exports = router;