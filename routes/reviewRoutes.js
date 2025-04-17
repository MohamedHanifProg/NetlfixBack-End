const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsByMovieId,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Create a review
router.post('/', protect, createReview);

// Get reviews for a specific movie
router.get('/:tmdb_id', protect, getReviewsByMovieId);

// Update a specific review by ID
router.put('/:id', protect, updateReview);

// Delete a specific review by ID
router.delete('/:id', protect, deleteReview);

module.exports = router;