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
});

const Theme = mongoose.model('Theme', ThemeSchema);

async function addPaceThemeField() {
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all themes that don't have paceTheme field
    const themes = await Theme.find({ paceTheme: { $exists: false } });
    console.log(`Found ${themes.length} themes without paceTheme field`);

    // Add paceTheme field to each theme
    for (const theme of themes) {
      theme.paceTheme = 'center-atom';
      await theme.save();
      console.log(`Updated theme: ${theme.siteTitle || 'Untitled'}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addPaceThemeField();
}

module.exports = addPaceThemeField;
