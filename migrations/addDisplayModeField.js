const mongoose = require('mongoose');
const FeaturedVideo = require('../models/FeaturedVideo');
require('dotenv').config();

async function addDisplayModeField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI ||
        'mongodb+srv://logan:u3zysPKXd9z4MRv8@logans-run-project.fj8racf.mongodb.net/test?retryWrites=true&w=majority'
    );
    console.log('✅ Connected to MongoDB');

    // Update all existing featured videos to have displayMode: 'full'
    const result = await FeaturedVideo.updateMany(
      { displayMode: { $exists: false } }, // Find documents without displayMode field
      { $set: { displayMode: 'full' } } // Set displayMode to 'full' for existing videos
    );

    console.log(
      `✅ Updated ${result.modifiedCount} featured videos with displayMode: 'full'`
    );

    // Verify the update
    const videos = await FeaturedVideo.find({});
    console.log(`📊 Total featured videos: ${videos.length}`);

    const fullModeVideos = await FeaturedVideo.countDocuments({
      displayMode: 'full',
    });
    const videoOnlyVideos = await FeaturedVideo.countDocuments({
      displayMode: 'videoOnly',
    });

    console.log(`📊 Videos with 'full' display mode: ${fullModeVideos}`);
    console.log(`📊 Videos with 'videoOnly' display mode: ${videoOnlyVideos}`);

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addDisplayModeField()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addDisplayModeField;
