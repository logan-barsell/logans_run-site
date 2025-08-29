const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThemeSchema = new Schema({
  // Site Information
  siteTitle: {
    type: String,
    trim: true,
    default: "Logan's Run",
  },
  greeting: {
    type: String,
    trim: true,
  },
  introduction: {
    type: String,
    trim: true,
  },
  bandLogoUrl: {
    type: String,
    trim: true,
  },

  // Header & Navigation
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

  // Colors
  primaryColor: {
    type: String,
    default: '#000000',
  },
  secondaryColor: {
    type: String,
    default: '#000000',
  },
  backgroundColor: {
    type: String,
    enum: [
      'black',
      'purple',
      'red',
      'green',
      'teal',
      'blue',
      'burgundy',
      'gray',
      'brown',
      'pink',
      'white',
    ],
    default: 'black',
  },

  // Typography
  primaryFont: {
    type: String,
    enum: [
      'Anton',
      'ArchitectsDaughter',
      'BebasNeue',
      'ComicNeue',
      'Creepster',
      'IndieFlower',
      'Kalam',
      'Lobster',
      'Orbitron',
      'Oswald',
      'Pacifico',
      'Righteous',
      'RobotoCondensed',
      'Sancreek',
      'sprayPaint',
      'VT323',
    ],
    default: 'Anton',
  },
  secondaryFont: {
    type: String,
    enum: [
      'Anton',
      'ArchitectsDaughter',
      'BebasNeue',
      'ComicNeue',
      'Courier New',
      'Creepster',
      'IndieFlower',
      'Kalam',
      'Lobster',
      'Orbitron',
      'Oswald',
      'Pacifico',
      'Righteous',
      'RobotoCondensed',
      'Sancreek',
      'sprayPaint',
      'VT323',
    ],
    default: 'RobotoCondensed',
  },

  // Social Media Icons
  socialMediaIconStyle: {
    type: String,
    enum: ['default', 'colorful'],
    default: 'default',
  },

  // Newsletter Settings
  enableNewsletter: {
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
ThemeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Theme = mongoose.model('Theme', ThemeSchema);

module.exports = Theme;
