// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfiles, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profiles', protect, getProfiles);
router.put('/profiles/:profileId', protect, updateProfile);

module.exports = router;
