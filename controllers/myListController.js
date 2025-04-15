const MyList = require('../models/MyList');

// Add item to "My List"
const addToList = async (req, res) => {
  try {
    const { id, media_type, title, poster_path, backdrop_path } = req.body;
    const userId = req.user._id;

    const existing = await MyList.findOne({ tmdb_id: id, userId });
    if (existing) {
      return res.status(400).json({ message: 'Item already exists in list' });
    }

    const newItem = new MyList({
      userId,
      tmdb_id: id,
      media_type,
      title,
      poster_path,
      backdrop_path
    });

    await newItem.save();
    res.status(201).json({ message: 'Added to list' });
  } catch (err) {
    console.error('Error adding to list:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all items in "My List"
const getMyList = async (req, res) => {
  try {
    const userId = req.user._id;
    const list = await MyList.find({ userId });
    res.status(200).json(list);
  } catch (err) {
    console.error('Error getting list:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove item from list
const removeFromList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // this is tmdb_id
    await MyList.deleteOne({ userId, tmdb_id: id });
    res.status(200).json({ message: 'Removed from list' });
  } catch (err) {
    console.error('Error removing from list:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addToList,
  getMyList,
  removeFromList
};
