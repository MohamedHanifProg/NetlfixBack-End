// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');


const assetsBaseUrl = process.env.FRONTEND_ASSETS_BASE_URL || 'http://localhost:5173';

const avatars = [
  `${assetsBaseUrl}/assets/avatar1.png`,
  `${assetsBaseUrl}/assets/avatar2.png`,
  `${assetsBaseUrl}/assets/avatar3.png`,
];

const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create a new user
    const user = await User.create({ name, email, phone, password });
    
    // Pick a random avatar from the array
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    // Create a default profile for the user (using push to add to the profiles array)
    user.profiles.push({ profileName: name, avatar: randomAvatar });
    await user.save();
    
    // Return the newly registered user (omit password in production)
    res.status(201).json({ user });
    
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token });
    
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
