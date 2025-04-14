const axios = require('axios');
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

exports.getTrending = async (req, res) => {
  const page = req.query.page || 1;
  try {
    const url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`;
    const response = await axios.get(url);

    const results = response.data.results.map(item => ({
      ...item,
      media_type: item.media_type || 'movie'
    }));

    res.json(results);
  } catch (err) {
    console.error('Failed to fetch trending data:', err);
    res.status(500).json({ error: 'Failed to fetch trending content' });
  }
};
