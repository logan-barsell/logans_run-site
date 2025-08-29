const mongoose = require('mongoose');
require('dotenv').config();
const keys = require('../config/keys');

const ThemeSchema = new mongoose.Schema({
  siteTitle: String,
  primaryColor: String,
  secondaryColor: String,
  primaryFont: String,
  bandLogoUrl: String,
  secondaryFont: { type: String, default: 'Courier New' },
  catchPhrase: { type: String, default: 'Welcome to our site' },
  paceTheme: { type: String, default: 'center-atom' },
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
  backgroundColor: {
    type: String,
    enum: [
      'black',
      'metal',
      'punk',
      'indie',
      'electronic',
      'blues',
      'burgundy',
      'dark-gray',
    ],
    default: 'black',
  },
  socialMediaIconStyle: {
    type: String,
    enum: ['default', 'minimal', 'colorful', 'outlined', 'filled'],
    default: 'default',
  },
  newsletterEnabled: { type: Boolean, default: true },
});

const Theme = mongoose.model('Theme', ThemeSchema);

async function addSocialMediaIconStyle() {
  try {
    await mongoose.connect(keys.mongoURI);
    console.log('Connected to MongoDB');

    // Find all themes that don't have socialMediaIconStyle field
    const themes = await Theme.find({
      socialMediaIconStyle: { $exists: false },
    });

    if (themes.length === 0) {
      console.log('No themes found that need updating');
      return;
    }

    console.log(`Found ${themes.length} themes to update`);

    // Update each theme to add the socialMediaIconStyle field with default value
    for (const theme of themes) {
      await Theme.updateOne(
        { _id: theme._id },
        { $set: { socialMediaIconStyle: 'default' } }
      );
      console.log(`Updated theme: ${theme.siteTitle || theme._id}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addSocialMediaIconStyle();
