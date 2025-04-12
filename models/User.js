// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Profile subdocument schema for each user (max 5 profiles)
const ProfileSchema = new mongoose.Schema(
  {
    profileName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { _id: false, timestamps: true }
);

// Custom validator to ensure no more than 5 profiles are added
function arrayLimit(val) {
  return val.length <= 5;
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    profiles: {
      type: [ProfileSchema],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Validate: at least 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(this.password)) {
    return next(
      new Error(
        'Password must be at least 8 characters long and contain at least one letter and one number.'
      )
    );
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
