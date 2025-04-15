// models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      default: 'info',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
