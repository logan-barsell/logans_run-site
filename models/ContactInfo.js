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

  // Social Media Links (public-facing)
  facebook: String,
  instagram: String,
  youtube: String,
  soundcloud: String,
  spotify: String,
  appleMusic: String,
  x: String,
  tiktok: String,

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
