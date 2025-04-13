// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getProfiles, updateProfile, addProfile , deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profiles', protect, getProfiles);
router.put('/profiles/:profileId', protect, updateProfile);
router.post('/profiles', protect, addProfile); 
router.delete('/profiles/:profileId', protect, deleteProfile);

module.exports = router;
