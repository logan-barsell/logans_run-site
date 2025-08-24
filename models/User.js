const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Band Information
  bandName: {
    type: String,
    required: true,
    trim: true,
  },

  // Admin Contact Information (for account management)
  adminEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  adminPhone: {
    type: String,
    trim: true,
  },

  // Authentication
  password: {
    type: String,
    required: true,
  },

  // Password Reset
  resetToken: String,
  resetTokenExpiry: Date,

  // Account Settings
  isActive: {
    type: Boolean,
    default: true,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password reset token is valid
userSchema.methods.isResetTokenValid = function () {
  return (
    this.resetToken &&
    this.resetTokenExpiry &&
    this.resetTokenExpiry > Date.now()
  );
};

module.exports = mongoose.model('User', userSchema);
