const express = require('express');
const router = express.Router();
const controller = require('../controllers/newpopularController'); // ✅ make sure the file path is correct

router.get('/', controller.getTrending); // ✅ controller.getTrending must be a function

module.exports = router;
