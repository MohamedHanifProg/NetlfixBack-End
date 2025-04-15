const express = require('express');
const router = express.Router();

const {
  addToList,
  getMyList,
  removeFromList
} = require('../controllers/myListController');

const { protect } = require('../middlewares/authMiddleware');

// Add item to "My List"
router.post('/add', protect, addToList);

// Get all items in "My List" for the logged-in user
router.get('/', protect, getMyList);

// Remove item from "My List" (by TMDB id)
router.delete('/:id', protect, removeFromList);

module.exports = router;
