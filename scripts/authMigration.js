const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Migration script to update existing users with new authentication fields
 */
async function migrateUsers() {
  try {
    logger.info('Starting user migration...');

    // Connect to MongoDB
    const mongoURI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/logans_run';
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    logger.info(`Found ${users.length} users to migrate`);

    for (const user of users) {
      const updates = {};

      // Set default values for new fields if they don't exist
      if (!user.role) {
        updates.role = 'ADMIN'; // Default existing users to admin
      }
      if (!user.userType) {
        updates.userType = 'ADMIN'; // Default existing users to admin
      }
      if (!user.status) {
        updates.status = 'ACTIVE'; // Default existing users to active
      }
      if (!user.verified) {
        updates.verified = true; // Default existing users to verified
      }
      if (!user.firstName) {
        updates.firstName = 'Admin'; // Default first name
      }
      if (!user.lastName) {
        updates.lastName = 'User'; // Default last name
      }

      // Update user if there are changes
      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, updates);
        logger.info(`Migrated user: ${user.adminEmail}`);
      }
    }

    logger.info('User migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateUsers()
    .then(() => {
      logger.info('Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateUsers };
