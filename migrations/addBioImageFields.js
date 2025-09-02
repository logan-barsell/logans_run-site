const mongoose = require('mongoose');
const Bio = require('../models/BioText');
require('../config/database');

async function addBioImageFields() {
  try {
    console.log('Starting migration: addBioImageFields');

    // Wait for database connection
    await mongoose.connection.asPromise();

    // Update all existing bio records to have default imageType
    const result = await Bio.updateMany(
      { imageType: { $exists: false } },
      {
        $set: {
          imageType: 'band-logo',
          customImageUrl: null,
        },
      }
    );

    console.log(
      `Updated ${result.modifiedCount} bio records with default image settings`
    );
    console.log('Migration completed successfully');

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  addBioImageFields()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addBioImageFields;
