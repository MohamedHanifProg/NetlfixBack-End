// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Create a review (secured route)
router.post('/', protect, createReview);

module.exports = router;
