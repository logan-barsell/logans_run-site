const mongoose = require('mongoose');
const { Schema } = mongoose;

// Public-facing contact information for the band/artist

const ContactSchema = new Schema({
  // Public Contact Information
  publicEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },

  publicPhone: {
    type: String,
    trim: true,
  },

  // Social Media Links (public-facing) with URL validation
  facebook: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        // Basic URL validation - will be enhanced in service layer
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid Facebook URL format',
    },
  },

  instagram: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid Instagram URL format',
    },
  },

  youtube: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid YouTube URL format',
    },
  },

  soundcloud: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid SoundCloud URL format',
    },
  },

  spotify: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid Spotify URL format',
    },
  },

  appleMusic: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid Apple Music URL format',
    },
  },

  x: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid X (Twitter) URL format',
    },
  },

  tiktok: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Optional field
        try {
          new URL(v.startsWith('http') ? v : `https://${v}`);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid TikTok URL format',
    },
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
ContactSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const ContactInfo = mongoose.model('Contact', ContactSchema);

module.exports = ContactInfo;
