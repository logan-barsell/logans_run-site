const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThemeSchema = new Schema({
  siteTitle: String,
  primaryColor: String,
  secondaryColor: String,
  primaryFont: String,
  bandLogoUrl: String,
  secondaryFont: { type: String, default: 'Courier New' },
  catchPhrase: { type: String, default: 'Welcome to our site' },
  // paceTheme: { type: String, default: 'center-atom' },
  paceTheme: { type: String, default: 'center-atom' },

  // Header/Navbar Customizations
  headerDisplay: {
    type: String,
    enum: ['band-name-only', 'band-name-and-logo', 'logo-only'],
    default: 'band-name-and-logo',
  },
  headerPosition: {
    type: String,
    enum: ['left', 'center', 'right'],
    default: 'left',
  },

  // Background Color
  backgroundColor: { type: String, default: '#272727' },

  // Social Media Icons
  socialMediaIconStyle: {
    type: String,
    enum: ['default', 'minimal', 'colorful', 'outlined', 'filled'],
    default: 'default',
  },

  // Newsletter Settings
  newsletterEnabled: { type: Boolean, default: true },
});

const Theme = mongoose.model('Theme', ThemeSchema);

module.exports = Theme;
