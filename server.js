// server.js
const express = require('express');
const cors = require('cors'); // Import the CORS middleware
const connectDB = require('./db_connection');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// CORS configuration options
const corsOptions = {
  // In development, allow requests from your local frontend:
  origin: ["http://localhost:5173", "https://your-app.netlify.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
  optionsSuccessStatus: 200 
};

// Enable CORS using the specified options
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Define your routes
app.use('/api/users', userRoutes);

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
