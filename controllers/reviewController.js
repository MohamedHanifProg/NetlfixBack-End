// controllers/reviewController.js
const Review = require('../models/Review');

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
    console.log('Review created:', review);
    res.status(201).json({ review });
  } catch (error) {
    console.error('Error in createReview:', error);
    next(error);
  }
};


module.exports = { createReview };
