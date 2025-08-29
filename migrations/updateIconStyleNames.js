const mongoose = require('mongoose');
const keys = require('../config/keys');

async function updateIconStyleNames() {
  try {
    await mongoose.connect(keys.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const Theme = require('../models/Theme');

    // Update any themes that have 'colorful' icon style to 'colored'
    const result = await Theme.updateMany(
      { socialMediaIconStyle: 'colorful' },
      { $set: { socialMediaIconStyle: 'colored' } }
    );

    console.log(
      `Updated ${result.modifiedCount} themes from 'colorful' to 'colored'`
    );
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateIconStyleNames();
