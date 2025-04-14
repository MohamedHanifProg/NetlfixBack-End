// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db_connection');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const homepageRoutes = require('./routes/homepageRoutes'); // NEW route for homepage endpoints

require('dotenv').config();

const app = express();

// Define basic CORS options (adjust as needed)
const corsOptions = {
  origin: '*' // Allow all origins. In production, restrict this to your front-end domain.
};

// Enable CORS using the specified options
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Define your routes
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/homepage', homepageRoutes);  // NEW: All homepage-related API calls go here

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
