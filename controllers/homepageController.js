// controllers/homepageController.js
const axios = require('axios');
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const getCover = async (req, res) => {
  try {
    const [moviesRes, tvRes] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: { sort_by: 'popularity.desc', api_key: TMDB_API_KEY }
      }),
      axios.get(`${TMDB_BASE_URL}/discover/tv`, {
        params: { sort_by: 'popularity.desc', api_key: TMDB_API_KEY }
      })
    ]);

    const movies = moviesRes.data.results.map(m => ({ ...m, media_type: 'movie' }));
    const tvShows = tvRes.data.results.map(t => ({ ...t, media_type: 'tv' }));
    const combined = [...movies.slice(0, 2), ...tvShows.slice(0, 2)];
    const random = combined[Math.floor(Math.random() * combined.length)];

    res.json(random);
  } catch (error) {
    console.error('Error fetching cover:', error.message);
    res.status(500).json({ message: 'Error fetching cover' });
  }
};

const proxyTmdb = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ message: 'Missing TMDB URL' });

    const fullUrl = `${TMDB_BASE_URL}${url}`;
    const response = await axios.get(fullUrl, {
      params: { api_key: TMDB_API_KEY }
    });

    res.json(response.data);
  } catch (error) {
    console.error('TMDB proxy error:', error.message);
    res.status(500).json({ message: 'Failed to fetch from TMDB' });
  }
};

module.exports = {
  getCover,
  proxyTmdb
};
