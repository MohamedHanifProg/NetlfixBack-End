const express = require('express');
const router = express.Router();
const tvshowsController = require('../controllers/tvshowsController');

router.get('/cover', tvshowsController.getCover);
router.get('/matched', tvshowsController.getMatched);
router.get('/netflix', tvshowsController.getNetflix);
router.get('/top10', tvshowsController.getTop10);
router.get('/animation', tvshowsController.getAnimation);
router.get('/adultAnimation', tvshowsController.getAdultAnimation);

module.exports = router;
