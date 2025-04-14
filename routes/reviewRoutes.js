const express = require('express');
const router = express.Router();
const { postReview } = require('../controllers/reviewController');

router.post('/', postReview);

module.exports = router;
