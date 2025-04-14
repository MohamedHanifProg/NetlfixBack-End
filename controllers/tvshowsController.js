const axios = require('axios');

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Reusable fetch helper
const fetchTMDB = async (endpoint) => {
  const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  const response = await axios.get(url);
  return response.data.results;
};

// Attach media_type to each show
const prepareResults = (results, limit = null) => {
  const tagged = results.map(item => ({ ...item, media_type: 'tv' }));
  return limit ? tagged.slice(0, limit) : tagged;
};

exports.getCover = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/tv?sort_by=popularity.desc');
    const picks = prepareResults(data, 4);
    const random = picks[Math.floor(Math.random() * picks.length)];
    res.json(random);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch TV cover' });
  }
};

exports.getMatched = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/tv?sort_by=popularity.desc');
    res.json(prepareResults(data, 10));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matched TV shows' });
  }
};

exports.getNetflix = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/tv?with_networks=213');
    res.json(prepareResults(data, 10));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Netflix TV shows' });
  }
};

exports.getTop10 = async (req, res) => {
  try {
    const data = await fetchTMDB('/tv/top_rated?region=US');
    res.json(prepareResults(data, 10));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Top 10 TV shows' });
  }
};

exports.getAnimation = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/tv?with_genres=16');
    res.json(prepareResults(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch animation TV shows' });
  }
};

exports.getAdultAnimation = async (req, res) => {
  try {
    const data = await fetchTMDB('/discover/tv?with_genres=16&include_adult=true');
    res.json(prepareResults(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch adult animation TV shows' });
  }
};
