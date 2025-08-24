const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  sessionId: {
    type: String,
    unique: true,
  },

  loginTime: {
    type: Date,
    default: Date.now,
  },

  logoutTime: {
    type: Date,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  ipAddress: {
    type: String,
  },

  userAgent: {
    type: String,
  },

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
sessionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Note: sessionId is now generated in the session service

// Index for efficient queries
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
