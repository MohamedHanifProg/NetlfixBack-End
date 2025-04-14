const axios = require('axios');

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Fetch helper
const fetchTMDB = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  const res = await axios.get(url);
  return res.data.results;
};

// Helper to tag media type and limit
const prepareResults = (results, limit = null) => {
  const tagged = results.map(item => ({ ...item, media_type: 'movie' }));
  return limit ? tagged.slice(0, limit) : tagged;
};

exports.getCover = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
    const picks = prepareResults(data, 4);
    const random = picks[Math.floor(Math.random() * picks.length)];
    res.json(random);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie cover' });
  }
};

exports.getMatched = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
    res.json(prepareResults(data, 10));
  } catch {
    res.status(500).json({ error: 'Failed to fetch matched movies' });
  }
};

exports.getTop10 = async (req, res) => {
  try {
    const data = await fetchTMDB('/movie/top_rated?region=US');
    res.json(prepareResults(data, 10));
  } catch {
    res.status(500).json({ error: 'Failed to fetch top 10 movies' });
  }
};

exports.getLove = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch love movies' });
  }
};

exports.getAnimation = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?with_genres=16');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch animation movies' });
  }
};

exports.getInspiring = async (req, res) => {
  try {
    const data = await fetchTMDB('/search/movie?query=inspiring');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch inspiring movies' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?sort_by=popularity.desc');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

exports.getWeekend = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?with_runtime.lte=90');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch weekend movies' });
  }
};

exports.getCritics = async (req, res) => {
  try {
    const data = await fetchTMDB('/movie/top_rated');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch critically acclaimed movies' });
  }
};

exports.getFresh = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/movie?sort_by=vote_average.desc');
    res.json(prepareResults(data));
  } catch {
    res.status(500).json({ error: 'Failed to fetch fresh movies' });
  }
};
