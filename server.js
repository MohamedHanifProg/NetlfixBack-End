// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db_connection');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const movieRoutes = require('./routes/movieRoutes');
const tvshowsRoutes = require('./routes/tvshowsRoutes'); // ✅ add this line
const newPopularRoutes = require('./routes/newpopularRoutes');
const browseRoutes = require('./routes/browseRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const detailsRoutes = require('./routes/detailRoutes');
const app = express();

// CORS options
const corsOptions = {
  origin: '*', // In production, set this to your frontend domain
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);

app.use('/api/homepage', homepageRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tvshows', tvshowsRoutes);
app.use('/api/trending', newPopularRoutes);
app.use('/api/browse', browseRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/details', detailsRoutes); 
app.use('/api/reviews', reviewRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
