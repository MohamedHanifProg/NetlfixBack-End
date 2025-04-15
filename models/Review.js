// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Change the type here to Number (or String) to match your external movie IDs
  program: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
