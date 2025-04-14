const express = require('express');
const router = express.Router();
const browseController = require('../controllers/browseController');

router.get('/', browseController.getBrowseResults);

module.exports = router;
