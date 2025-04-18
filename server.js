// server.js
const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
dotenv.config();

const connectDB = require('./db_connection');

// ────────────── middlewares
const { protect } = require('./middlewares/authMiddleware');
const admin       = require('./middlewares/adminMiddleware');

// ────────────── public‑/regular‑user routers
const userRoutes      = require('./routes/userRoutes');
const profileRoutes   = require('./routes/profileRoutes');
const homepageRoutes  = require('./routes/homepageRoutes');
const movieRoutes     = require('./routes/movieRoutes');
const tvshowsRoutes   = require('./routes/tvshowsRoutes');
const trendingRoutes  = require('./routes/newpopularRoutes');
const browseRoutes    = require('./routes/browseRoutes');
const reviewRoutes    = require('./routes/reviewRoutes');
const detailsRoutes   = require('./routes/detailRoutes');
const myListRoutes = require('./routes/myListRoutes');
// ────────────── admin router (wraps the admin sub‑routers)
const adminRoutes = require('./routes/adminRoutes');
const logRoutes = require('./routes/logRoutes');
const programRoutes = require('./routes/programRoutes');

const app = express();

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://admirable-sable-4e8a5d.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true // if you're using cookies or auth headers
}));

app.use(express.json());

// DB
connectDB();

// ────────────── public/regular endpoints
app.use('/api/users', userRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/homepage',  homepageRoutes);
app.use('/api/movies',    movieRoutes);
app.use('/api/tvshows',   tvshowsRoutes);
app.use('/api/trending',  trendingRoutes);
app.use('/api/browse',    browseRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/details',   detailsRoutes);
app.use('/api/mylist', myListRoutes);

// ────────────── admin‑only endpoints
// 401 → not logged‑in, 403 → not admin
app.use('/api/logs',   logRoutes);
app.use('/api/programs', programRoutes);  
app.use('/api/admin', protect, admin, adminRoutes);

// ────────────── global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ────────────── start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("API is working");
});
