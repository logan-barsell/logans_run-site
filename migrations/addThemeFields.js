const mongoose = require('mongoose');
const Theme = require('../models/Theme');
const config = require('../config');

async function migrateThemeFields() {
  try {
    // Connect to database
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find all existing themes
    const themes = await Theme.find({});
    console.log(`Found ${themes.length} themes to migrate`);

    // Update each theme with new fields
    for (const theme of themes) {
      const updates = {};

      // Add new fields with defaults if they don't exist
      if (theme.headerDisplay === undefined) {
        updates.headerDisplay = 'band-name-and-logo';
      }
      if (theme.headerPosition === undefined) {
        updates.headerPosition = 'left';
      }
      if (theme.backgroundColor === undefined) {
        updates.backgroundColor = '#272727';
      }
      if (theme.socialMediaIconStyle === undefined) {
        updates.socialMediaIconStyle = 'default';
      }

      // Update theme if there are changes
      if (Object.keys(updates).length > 0) {
        await Theme.findByIdAndUpdate(theme._id, updates);
        console.log(`Updated theme: ${theme.siteTitle || 'Untitled'}`);
      }
    }

    console.log('Theme migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateThemeFields();
}

module.exports = migrateThemeFields;
