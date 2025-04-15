// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const { protect } = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

router.get('/', protect, adminOnly, getLogs);

module.exports = router;
