const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validatePasswordDetailed } = require('../utils/validation');

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

  // Account Lockout Protection
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Date,
  },
  lastFailedLogin: {
    type: Date,
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
    // Validate password strength before hashing
    const passwordValidation = validatePasswordDetailed(this.password);
    if (!passwordValidation.isValid) {
      const error = new Error(passwordValidation.errors.join('. '));
      error.statusCode = 400;
      return next(error);
    }

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

// Method to check if account is currently locked
userSchema.methods.isAccountLocked = function () {
  return !!(this.lockedUntil && this.lockedUntil > Date.now());
};

// Method to get remaining lockout time in minutes
userSchema.methods.getLockoutTimeRemaining = function () {
  if (!this.isAccountLocked()) return 0;
  return Math.ceil((this.lockedUntil - Date.now()) / (1000 * 60));
};

// Method to handle failed login attempt
userSchema.methods.handleFailedLogin = function () {
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MINUTES = 15;

  this.failedLoginAttempts += 1;
  this.lastFailedLogin = new Date();

  if (this.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    this.lockedUntil = new Date(
      Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
    );
    this.failedLoginAttempts = 0; // Reset attempts after lockout
  }

  return this.save();
};

// Method to handle successful login (reset failed attempts)
userSchema.methods.handleSuccessfulLogin = function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  this.lastFailedLogin = undefined;
  return this.save();
};

// Virtual for UUID (using _id as UUID equivalent)
userSchema.virtual('uuid').get(function () {
  return this._id.toString();
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
