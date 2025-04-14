// utils/tmdbProxy.js
const axios = require('axios');
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const proxyTMDB = async (path, extraParams = {}) => {
  const url = `${TMDB_BASE_URL}${path}`;
  const params = { api_key: TMDB_API_KEY, ...extraParams };
  const response = await axios.get(url, { params });
  return response.data;
};

module.exports = proxyTMDB;
