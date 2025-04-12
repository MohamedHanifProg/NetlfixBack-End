// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Profile subdocument schema (each profile now gets its own _id)
const ProfileSchema = new mongoose.Schema(
  {
    profileName: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: String, 
      required: true 
    }
  },
  { timestamps: true }  // automatically adds createdAt and updatedAt
);

// Validator to ensure a user has no more than 5 profiles
function arrayLimit(val) {
  return val.length <= 5;
}

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true 
    },
    phone: { 
      type: String, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['admin', 'user'], 
      default: 'user' 
    },
    profiles: {
      type: [ProfileSchema],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5']
    }
  },
  { timestamps: true }
);

// Pre-save middleware to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Validate password: at least 8 characters, one letter and one number.
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(this.password)) {
    return next(
      new Error('Password must be at least 8 characters long and contain at least one letter and one number.')
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

// Instance method to compare a candidate password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
