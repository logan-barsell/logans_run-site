const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    unique: true,
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

  // User details
  firstName: {
    type: String,
    trim: true,
  },

  lastName: {
    type: String,
    trim: true,
  },

  fullName: {
    type: String,
    trim: true,
  },

  // Role and status
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'SUPERADMIN'],
    default: 'USER',
  },

  userType: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },

  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },

  verified: {
    type: Boolean,
    default: false,
  },

  // Account management
  invitedByUUID: {
    type: String,
  },

  deactivatedByUUID: {
    type: String,
  },

  deactivatedAt: {
    type: Date,
  },

  // Password Reset
  resetToken: String,
  resetTokenExpiry: Date,

  // Two-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  twoFactorCode: String,
  twoFactorCodeExpiry: Date,

  // Security Preferences
  securityPreferences: {
    loginAlerts: {
      type: Boolean,
      default: false,
    },
  },

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

  // Generate full name if firstName and lastName are provided
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

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

// Method to check if 2FA code is valid
userSchema.methods.isTwoFactorCodeValid = function () {
  return (
    this.twoFactorCode &&
    this.twoFactorCodeExpiry &&
    this.twoFactorCodeExpiry > Date.now()
  );
};

// Virtual for UUID (using _id as UUID equivalent)
userSchema.virtual('uuid').get(function () {
  return this._id.toString();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
