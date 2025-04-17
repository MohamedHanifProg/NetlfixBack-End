const axios = require('axios');
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
const Review = require('../models/Review');
const Program = require('../models/Program');
const { recommendByDescription } = require('../utils/recommendByDescription');
const mongoose = require('mongoose'); 

const fetchTMDB = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data.results;
};

// Helper to limit and tag media type
const prepareResults = (results, limit = null, mediaType = 'movie') => {
  const tagged = results.map(item => ({ ...item, media_type: mediaType }));
  return limit ? tagged.slice(0, limit) : tagged;
};

exports.getCover = async (req, res) => {
  try {
    const [movies, tv] = await Promise.all([
      fetchTMDB('/discover/movie?sort_by=popularity.desc'),
      fetchTMDB('/discover/tv?sort_by=popularity.desc'),
    ]);
    
    // Mix top 2 from each
    const combined = [
      ...prepareResults(movies, 2, 'movie'),
      ...prepareResults(tv, 2, 'tv'),
    ];

    res.json(combined); // Send array of 4
  } catch (err) {
    console.error('Failed to fetch cover:', err);
    res.status(500).json({ error: 'Failed to fetch cover' });
  }
};

exports.getMatched = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's reviews
    const userReviews = await Review.find({ user: userId });

    // Extract the review texts
    const likedOverviews = userReviews.map(r => r.text);

    // Get all programs from MongoDB (not from TMDB)
    const allPrograms = await Program.find();

    // Use AI to get top 10 matches
    const recommendations = await recommendByDescription(likedOverviews, allPrograms);

    res.status(200).json(recommendations);
  } catch (err) {
    console.error('AI Matching Error:', err);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};

exports.getNetflix = async (req, res) => {
  const data = await fetchTMDB('/discover/tv?with_networks=213');
  res.json(prepareResults(data, 10, 'tv'));
};

exports.getTop10 = async (req, res) => {
  const data = await fetchTMDB('/movie/top_rated?region=US');
  res.json(prepareResults(data, 10));
};

exports.getLove = async (req, res) => {
  const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
  res.json(prepareResults(data));
};

exports.getAnimation = async (req, res) => {
  const data = await fetchTMDB('/discover/movie?with_genres=16');
  res.json(prepareResults(data));
};

exports.getInspiring = async (req, res) => {
  const data = await fetchTMDB('/search/movie?query=inspiring');
  res.json(prepareResults(data));
};

exports.getWatchlist = async (req, res) => {
  const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
  res.json(prepareResults(data));
};

exports.getWeekend = async (req, res) => {
  const data = await fetchTMDB('/discover/movie?with_runtime.lte=90');
  res.json(prepareResults(data));
};

exports.getCritics = async (req, res) => {
  const data = await fetchTMDB('/movie/top_rated');
  res.json(prepareResults(data));
};

exports.getFresh = async (req, res) => {
  const data = await fetchTMDB('/discover/movie?sort_by=vote_average.desc');
  res.json(prepareResults(data));
};

exports.getAdultAnimation = async (req, res) => {
  const data = await fetchTMDB('/discover/tv?with_genres=16&include_adult=true');
  res.json(prepareResults(data, null, 'tv'));
};
// Proxy request to TMDB for full movie/TV show details
exports.getProxyDetails = async (req, res) => {
  const axios = require('axios');
  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'Missing URL param' });

  try {
    const response = await axios.get(`${BASE_URL}${url}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits' // Optional: get cast/crew
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('TMDB Proxy Error:', err.response?.data || err.message);
    res.status(404).json({ message: 'Failed to fetch from TMDB', error: err.message });
  }
};

exports.getRecent = async (req, res) => {
  try {
    const userId = req.user.id;
    const recentPrograms = await Review.aggregate([
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

    const formatted = recentPrograms.map((p) => ({
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
