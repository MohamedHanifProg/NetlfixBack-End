// models/Program.js
const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    externalId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['movie', 'tv'],
      required: true,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    overview: {
      type: String,
    },
    genres: [{
      type: String,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Program', programSchema);
