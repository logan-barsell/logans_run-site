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
  enableNewsletter: { type: Boolean, default: true },
  // New newsletter notification fields
  notifyOnNewShows: { type: Boolean, default: false },
  notifyOnNewMusic: { type: Boolean, default: false },
  notifyOnNewVideos: { type: Boolean, default: false },
});

const Theme = mongoose.model('Theme', ThemeSchema);

async function addNewsletterNotificationFields() {
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all themes that don't have the new newsletter notification fields
    const themes = await Theme.find({
      $or: [
        { notifyOnNewShows: { $exists: false } },
        { notifyOnNewMusic: { $exists: false } },
        { notifyOnNewVideos: { $exists: false } },
      ],
    });

    console.log(
      `Found ${themes.length} themes to update with newsletter notification fields`
    );

    // Add new fields to each theme
    for (const theme of themes) {
      const updates = {};

      if (theme.notifyOnNewShows === undefined) {
        updates.notifyOnNewShows = false;
      }
      if (theme.notifyOnNewMusic === undefined) {
        updates.notifyOnNewMusic = false;
      }
      if (theme.notifyOnNewVideos === undefined) {
        updates.notifyOnNewVideos = false;
      }

      if (Object.keys(updates).length > 0) {
        await Theme.findByIdAndUpdate(theme._id, updates);
        console.log(`Updated theme: ${theme.siteTitle || 'Untitled'}`);
      }
    }

    console.log(
      'Newsletter notification fields migration completed successfully'
    );
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addNewsletterNotificationFields();
}

module.exports = addNewsletterNotificationFields;
