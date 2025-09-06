const mongoose = require('mongoose');
const FeaturedVideo = require('../models/FeaturedVideo');
require('dotenv').config();

async function addVideoUploadFields() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI ||
        'mongodb+srv://logan:u3zysPKXd9z4MRv8@logans-run-project.fj8racf.mongodb.net/test?retryWrites=true&w=majority'
    );
    console.log('✅ Connected to MongoDB');

    // Update all existing FeaturedVideo documents
    const result = await FeaturedVideo.updateMany(
      { videoType: { $exists: false } }, // Only update documents that don't have videoType
      {
        $set: {
          videoType: 'youtube', // Set default video type for existing videos
        },
      }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} FeaturedVideo documents with videoType: 'youtube'`
    );

    // Verify the update
    const count = await FeaturedVideo.countDocuments({ videoType: 'youtube' });
    console.log(`✅ Total documents with videoType 'youtube': ${count}`);

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run migration if called directly
if (require.main === module) {
  addVideoUploadFields()
    .then(() => {
      console.log('🎉 Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addVideoUploadFields;
