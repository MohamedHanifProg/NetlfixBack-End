const axios = require('axios');
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

exports.getBrowseResults = async (req, res) => {
  const { page = 1, sort_by, with_genres, with_original_language } = req.query;

  const query = new URLSearchParams({
    api_key: API_KEY,
    page,
    sort_by: sort_by || 'popularity.desc',
    with_genres: with_genres || '',
    with_original_language: with_original_language || ''
  });

  try {
    const url = `${BASE_URL}/discover/movie?${query}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Failed to fetch browse results:', err.message);
    res.status(500).json({ error: 'Failed to fetch browse data' });
  }
};
