const express = require('express');
const router = express.Router();
const homepageController = require('../controllers/homepageController');

router.get('/cover', homepageController.getCover);
router.get('/proxy', homepageController.proxyTmdb);

module.exports = router;
