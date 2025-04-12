// server.js
const express = require('express');
const connectDB = require('./db_connection');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the user routes
app.use('/api/users', userRoutes);

// Global error-handling middleware (should be the last middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
