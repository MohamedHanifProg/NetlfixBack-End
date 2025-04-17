// controllers/reviewController.js
const Review = require('../models/Review');
const Log = require('../models/Log');

// Create a review
const createReview = async (req, res, next) => {
  try {
    const { movieId, title, text, isPublic, rating } = req.body;

    console.log('Creating review with:', { movieId, title, text, isPublic, rating });

    const review = await Review.create({
      user: req.user.id,
      program: movieId,
      title,
      text,
      isPublic,
      rating,
    });

    await Log.create({
      message: `Review submitted for program ${title} (ID: ${movieId}) with rating ${rating}.`,
      level: 'info',
    });

    console.log('Review created:', review);
    res.status(201).json({ review });
  } catch (error) {
    console.error('Error in createReview:', error);
    next(error);
  }
};

// Get all reviews for a specific movie (public + current user's private)
const getReviewsByMovieId = async (req, res, next) => {
  try {
    const tmdbId = req.params.tmdb_id;
    const userId = req.user?.id;

    const query = [
      { program: tmdbId, isPublic: true }
    ];

    if (userId) {
      query.push({ program: tmdbId, user: userId, isPublic: false });
    }

    const reviews = await Review.find({ $or: query }).populate('user', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error in getReviewsByMovieId:', error);
    next(error);
  }
};
// Update review
const updateReview = async (req, res, next) => {
    try {
      const reviewId = req.params.id;
      const { text, isPublic, rating } = req.body;
  
      const review = await Review.findById(reviewId);
  
      if (!review) return res.status(404).json({ message: 'Review not found' });
      if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
  
      review.text = text;
      review.isPublic = isPublic;
      review.rating = rating;
  
      await review.save();
      res.status(200).json({ message: 'Review updated', review });
    } catch (error) {
      next(error);
    }
  };
  
  // Delete review
  const deleteReview = async (req, res, next) => {
    try {
      const reviewId = req.params.id;
  
      const review = await Review.findById(reviewId);
      if (!review) return res.status(404).json({ message: 'Review not found' });
      if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
  
      await review.deleteOne();
      res.status(200).json({ message: 'Review deleted' });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    createReview,
    getReviewsByMovieId,
    updateReview,
    deleteReview
  };
  