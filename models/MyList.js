// models/MyList.js
const mongoose = require('mongoose');

const MyListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tmdb_id: { type: Number, required: true },
  media_type: { type: String, required: true },
  title: { type: String },
  poster_path: { type: String },
  backdrop_path: { type: String },
});

module.exports = mongoose.model('MyList', MyListSchema);
