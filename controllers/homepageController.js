// controllers/homepageController.js
/* eslint-disable camelcase */
const axios    = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY  = process.env.TMDB_API_KEY;

const Review   = require('../models/Review');
const Program  = require('../models/Program');
const MyList   = require('../models/MyList');
const { recommendByDescription } = require('../utils/recommendByDescription');

/* ───────── helpers ───────── */
const fetchTMDB = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  const { data } = await axios.get(url);
  return data.results;
};
const tag = (arr, mediaType, limit = null) =>
  (limit ? arr.slice(0, limit) : arr).map((x) => ({ ...x, media_type: mediaType }));

/* ───────── handlers ───────── */
const getCover = async (req, res) => {
  try {
    const [movies, tv] = await Promise.all([
      fetchTMDB('/discover/movie?sort_by=popularity.desc'),
      fetchTMDB('/discover/tv?sort_by=popularity.desc'),
    ]);
    res.json([
      ...tag(movies, 'movie', 2),
      ...tag(tv,     'tv',    2),
    ]);
  } catch (e) {
    console.error('Cover error:', e);
    res.status(500).json({ error: 'Failed to fetch cover' });
  }
};

const getMatched = async (req, res) => {
  try {
    const userId = req.user.id;

    /* positive reviews only */
    const reviews = await Review.find({ user: userId, rating: { $gte: 4 } });
    if (!reviews.length) return res.status(200).json([]);

    const texts   = reviews.map(r => r.text);
    const weights = reviews.map(r => r.rating);

    const programs = await Program.find();
    const ranked   = await recommendByDescription(texts, programs, weights);

    const seen   = new Set(reviews.map(r => r.program));
    const unseen = ranked.filter(p => !seen.has(p.externalId));

    const movies = unseen.filter(p => p.mediaType === 'movie').slice(0, 5);
    const series = unseen.filter(p => p.mediaType === 'tv')  .slice(0, 5);
    const recommendations = [...movies, ...series].slice(0, 10);

    res.status(200).json(recommendations);
  } catch (err) {
    console.error('AI Matching Error:', err);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};

const getNetflix = async (_req, res) => {
  const data = await fetchTMDB('/discover/tv?with_networks=213');
  res.json(tag(data, 'tv', 10));
};

const getTop10 = async (_req, res) => {
  const data = await fetchTMDB('/movie/top_rated?region=US');
  res.json(tag(data, 'movie', 10));
};

const getLove = async (_req, res) => {
  const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
  res.json(tag(data, 'movie'));
};

const getAnimation = async (_req, res) => {
  const data = await fetchTMDB('/discover/movie?with_genres=16');
  res.json(tag(data, 'movie'));
};

const getInspiring = async (_req, res) => {
  const data = await fetchTMDB('/search/movie?query=inspiring');
  res.json(tag(data, 'movie'));
};

const getWatchlist = async (_req, res) => {
  const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
  res.json(tag(data, 'movie'));
};

const getWeekend = async (_req, res) => {
  const data = await fetchTMDB('/discover/movie?with_runtime.lte=90');
  res.json(tag(data, 'movie'));
};

const getCritics = async (_req, res) => {
  const data = await fetchTMDB('/movie/top_rated');
  res.json(tag(data, 'movie'));
};

const getFresh = async (_req, res) => {
  const data = await fetchTMDB('/discover/movie?sort_by=vote_average.desc');
  res.json(tag(data, 'movie'));
};

const getAdultAnimation = async (_req, res) => {
  const data = await fetchTMDB('/discover/tv?with_genres=16&include_adult=true');
  res.json(tag(data, 'tv'));
};

const getProxyDetails = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'Missing URL param' });

  try {
    const { data } = await axios.get(`${BASE_URL}${url}`, {
      params: { api_key: API_KEY, append_to_response: 'credits' },
    });
    res.json(data);
  } catch (err) {
    console.error('TMDB Proxy Error:', err.response?.data || err.message);
    res.status(404).json({ message: 'Failed to fetch from TMDB', error: err.message });
  }
};

const getRecent = async (req, res) => {
  try {
    const userId = req.user.id;

    const recent = await Review.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $sort:  { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'programs',
          localField: 'program',
          foreignField: 'externalId',
          as: 'prog',
        },
      },
      { $unwind: '$prog' },
      { $replaceRoot: { newRoot: '$prog' } },
    ]);

    const formatted = recent.map(p => ({
      id:            p.externalId,
      title:         p.title,
      name:          p.title,
      media_type:    p.mediaType,
      poster_path:   p.posterPath,
      backdrop_path: p.backdropPath,
      overview:      p.overview,
      release_date:  p.releaseDate,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Recent‑reviews error:', err);
    res.status(500).json({ message: 'Failed to load recent reviews' });
  }
};

const getPopular = async (req, res) => {
  try {
    const userId = req.user.id;

    const agg = await Review.aggregate([
      { $match: { user: { $ne: new mongoose.Types.ObjectId(userId) }, isPublic: true } },
      { $group: {
          _id:       '$program',
          avgRating: { $avg: '$rating' },
          votes:     { $sum: 1 },
      }},
      { $match: { votes: { $gte: 1 } } },
      { $sort:  { avgRating: -1, votes: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'programs',
          localField: '_id',
          foreignField: 'externalId',
          as: 'prog',
        },
      },
      { $unwind: '$prog' },
    ]);

    const formatted = agg.map(x => ({
      id:            x.prog.externalId,
      title:         x.prog.title,
      name:          x.prog.title,
      media_type:    x.prog.mediaType,
      poster_path:   x.prog.posterPath,
      backdrop_path: x.prog.backdropPath,
      overview:      x.prog.overview,
      release_date:  x.prog.releaseDate,
      avg_rating:    x.avgRating.toFixed(1),
      votes:         x.votes,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Popular‑reviews error:', err);
    res.status(500).json({ message: 'Failed to load popular ratings' });
  }
};

const getMyListRecent = async (req, res) => {
  try {
    const userId = req.user.id;

    const docs = await MyList.find({ userId })
      .sort({ _id: -1 })
      .limit(10)
      .lean();

    const formatted = docs.map(d => ({
      id:            d.tmdb_id,
      title:         d.title,
      name:          d.title,
      media_type:    d.media_type,
      poster_path:   d.poster_path,
      backdrop_path: d.backdrop_path,
      overview:      '',
    }));

    res.json(formatted);
  } catch (err) {
    console.error('MyList‑recent error:', err);
    res.status(500).json({ message: 'Failed to load your list' });
  }
};

/* ───────── export everything once ───────── */
module.exports = {
  getCover,
  getMatched,
  getNetflix,
  getTop10,
  getLove,
  getAnimation,
  getInspiring,
  getWatchlist,
  getWeekend,
  getCritics,
  getFresh,
  getAdultAnimation,
  getProxyDetails,
  getRecent,
  getPopular,
  getMyListRecent,
};
