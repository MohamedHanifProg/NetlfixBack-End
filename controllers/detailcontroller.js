const axios = require('axios');
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// GET /api/details/movie/:id
exports.getMovieDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching movie details:', err.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

// GET /api/details/tv/:id
exports.getTvDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching TV details:', err.message);
    res.status(500).json({ error: 'Failed to fetch TV details' });
  }
};

// GET /api/details/tv/:id/season/1
exports.getSeasonOneEpisodes = async (req, res) => {
  const { id } = req.params;
  try {
    const url = `${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching episodes:', err.message);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
};
