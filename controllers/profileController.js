// controllers/profileController.js
const User = require('../models/User');

const getProfiles = async (req, res, next) => {
  try {
    const userId = req.user.id; // assuming the protect middleware sets req.user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ profiles: user.profiles });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const { profileName } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find the subdocument by id; Mongoose adds an 'id' getter to subdocuments.
    const profile = user.profiles.id(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    
    profile.profileName = profileName;
    await user.save();
    
    res.status(200).json({ message: "Profile updated", profile });
    
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfiles, updateProfile };
