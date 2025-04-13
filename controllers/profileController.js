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

const addProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { profileName, avatar } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Enforce maximum 5 profiles on the backend as well
    if (user.profiles.length >= 5) {
      return res.status(400).json({ message: "Maximum number of profiles reached" });
    }
    
    // Create new profile subdocument (Mongoose will automatically assign an _id)
    const newProfile = { profileName, avatar };
    user.profiles.push(newProfile);
    await user.save();

    // Return the newly created profile (the last one in the array)
    res.status(201).json({ profile: user.profiles[user.profiles.length - 1] });
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Remove the profile subdocument using the pull method
    user.profiles.pull(profileId);
    await user.save();
    
    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    next(error);
  }
};


module.exports = { getProfiles, updateProfile, addProfile , deleteProfile};

