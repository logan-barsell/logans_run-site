const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsletterSubscriberSchema = new Schema({
  // Subscriber Information
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },

  // Subscription Status
  isActive: {
    type: Boolean,
    default: true,
  },

  // Unsubscribe token for secure unsubscription
  unsubscribeToken: {
    type: String,
    unique: true,
    sparse: true,
  },

  // Subscription preferences
  preferences: {
    // Whether they want to receive automatic notifications
    receiveAutomaticNotifications: {
      type: Boolean,
      default: true,
    },
    // Specific notification preferences
    notifyOnNewShows: {
      type: Boolean,
      default: true,
    },
    notifyOnNewMusic: {
      type: Boolean,
      default: true,
    },
    notifyOnNewVideos: {
      type: Boolean,
      default: true,
    },
  },

  // Metadata
  signupSource: {
    type: String,
    enum: ['website', 'admin', 'import'],
    default: 'website',
  },

  // Bounce and Complaint Tracking
  bouncedAt: {
    type: Date,
  },
  bounceType: {
    type: String,
    enum: ['General', 'NoEmail', 'Suppressed', 'OnAccountSuppressionList'],
  },
  bounceReason: {
    type: String,
  },
  complaintType: {
    type: String,
    enum: ['abuse', 'auth-failure', 'fraud', 'not-spam', 'other', 'virus'],
  },
  unsubscribeReason: {
    type: String,
    enum: ['user', 'complaint', 'admin', 'bounce'],
  },

  // Timestamps
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
  },
  unsubscribedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
NewsletterSubscriberSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unsubscribe token before saving
NewsletterSubscriberSchema.pre('save', function (next) {
  if (!this.unsubscribeToken) {
    const crypto = require('crypto');
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Index for efficient queries
NewsletterSubscriberSchema.index({ email: 1 });
NewsletterSubscriberSchema.index({ isActive: 1 });
NewsletterSubscriberSchema.index({ unsubscribeToken: 1 });

const NewsletterSubscriber = mongoose.model(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);

module.exports = NewsletterSubscriber;
