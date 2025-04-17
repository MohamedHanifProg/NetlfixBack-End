// controllers/reviewController.js
const axios   = require('axios');
const Review  = require('../models/Review');
const Program = require('../models/Program');
const Log     = require('../models/Log');

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = 'https://api.themoviedb.org/3';

/* ──────────────────────────────────────────────
   CREATE REVIEW  — auto‑inserts Program if absent
──────────────────────────────────────────────── */
// CREATE REVIEW  — auto‑inserts Program if absent
const createReview = async (req, res, next) => {
  try {
    let { movieId, mediaType, title, text, isPublic, rating } = req.body;
    const userId = req.user.id;

    if (!movieId) return res.status(400).json({ message: 'movieId is required' });

    /* 1 ▸ if Program already exists, reuse its mediaType */
    let program = await Program.findOne({ externalId: movieId });
    if (program) mediaType = program.mediaType;

    /* 2 ▸ if still missing, default to 'movie' and try; if TMDB 404s, try 'tv' */
    if (!mediaType) {
      for (const guess of ['movie', 'tv']) {
        try {
          await axios.get(`${TMDB_URL}/${guess}/${movieId}`, {
            params: { api_key: TMDB_KEY },
          });
          mediaType = guess;
          break;
        } catch (_) {/* ignore */}
      }
      if (!mediaType)
        return res.status(400).json({ message: 'mediaType could not be inferred; pass "movie" or "tv"' });
    }

    /* 3 ▸ fetch or create the Program */
    if (!program) {
      const { data } = await axios.get(
        `${TMDB_URL}/${mediaType}/${movieId}`,
        { params: { api_key: TMDB_KEY, language: 'en-US' } }
      );

      program = await Program.create({
        externalId:   movieId,
        title:        data.title || data.name,
        mediaType,
        posterPath:   data.poster_path,
        backdropPath: data.backdrop_path,
        releaseDate:  data.release_date || data.first_air_date,
        overview:     data.overview,
        genres:       (data.genres || []).map(g => g.name),
      });
    }

    /* 4 ▸ create the Review (unchanged) */
    const review = await Review.create({
      user: userId,
      program: movieId,
      title,
      text,
      isPublic,
      rating,
    });

    await Log.create({ message: `Review submitted for ${program.title}`, level: 'info' });
    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};


/* ──────────────────────────────────────────────
   GET REVIEWS FOR ONE TITLE (public + own private)
──────────────────────────────────────────────── */
const getReviewsByMovieId = async (req, res, next) => {
  try {
    const tmdbId = req.params.tmdb_id;
    const userId = req.user?.id;

    const query = [{ program: tmdbId, isPublic: true }];
    if (userId) query.push({ program: tmdbId, user: userId, isPublic: false });

    const reviews = await Review
      .find({ $or: query })
      .populate('user', 'name');        // return reviewer’s name

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error in getReviewsByMovieId:', err);
    next(err);
  }
};

/* ──────────────────────────────────────────────
   UPDATE REVIEW
──────────────────────────────────────────────── */
const updateReview = async (req, res, next) => {
  try {
    const reviewId          = req.params.id;
    const { text, isPublic, rating } = req.body;

    const review = await Review.findById(reviewId);
    if (!review)           return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    review.text     = text;
    review.isPublic = isPublic;
    review.rating   = rating;
    await review.save();

    res.status(200).json({ message: 'Review updated', review });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────
   DELETE REVIEW
──────────────────────────────────────────────── */
const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);
    if (!review)           return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getReviewsByMovieId,
  updateReview,
  deleteReview,
};
