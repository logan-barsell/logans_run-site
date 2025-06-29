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
});

const Theme = mongoose.model('Theme', ThemeSchema);

module.exports = Theme;
