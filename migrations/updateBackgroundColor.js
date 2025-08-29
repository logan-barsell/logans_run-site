require('dotenv').config();
const mongoose = require('mongoose');
const keys = require('../config/keys');

// Connect to MongoDB
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Theme = require('../models/Theme');

async function migrateBackgroundColors() {
  try {
    console.log('Starting background color migration...');

    // Get all themes
    const themes = await Theme.find({});
    console.log(`Found ${themes.length} themes to migrate`);

    for (const theme of themes) {
      // Convert old hex color to new theme name
      let newBackgroundColor = 'black'; // default

      if (theme.backgroundColor) {
        const color = theme.backgroundColor.toLowerCase();

        // Map old hex colors to new theme names
        if (color === '#272727' || color === '#000000') {
          newBackgroundColor = 'black';
        } else if (color.includes('00') && color.includes('80')) {
          newBackgroundColor = 'navy';
        } else if (color.includes('64') && color.includes('00')) {
          newBackgroundColor = 'forest';
        } else if (color.includes('8b') && color.includes('00')) {
          newBackgroundColor = 'burgundy';
        } else if (color.includes('4b') && color.includes('82')) {
          newBackgroundColor = 'purple';
        } else if (color.includes('2f') && color.includes('4f')) {
          newBackgroundColor = 'dark-gray';
        }
      }

      // Update the theme
      await Theme.findByIdAndUpdate(theme._id, {
        backgroundColor: newBackgroundColor,
      });

      console.log(
        `Updated theme ${theme._id}: ${theme.backgroundColor} -> ${newBackgroundColor}`
      );
    }

    console.log('Background color migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateBackgroundColors();
