const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThemeSchema = new Schema({
  siteTitle: String,
  primaryColor: String,
  secondaryColor: String,
  primaryFont: String,
  bandLogoUrl: String,
  secondaryFont: { type: String, default: 'Courier New' },
});

const Theme = mongoose.model('Theme', ThemeSchema);

module.exports = Theme;
