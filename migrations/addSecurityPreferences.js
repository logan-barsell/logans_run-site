const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Migration: Add security preferences to existing users
 *
 * This migration adds default security preferences to all existing users
 * who don't already have them set.
 */
async function addSecurityPreferences() {
  try {
    logger.info('Starting migration: addSecurityPreferences');

    // Find all users without securityPreferences
    const usersWithoutPreferences = await User.find({
      $or: [
        { securityPreferences: { $exists: false } },
        { securityPreferences: null },
      ],
    });

    logger.info(
      `Found ${usersWithoutPreferences.length} users without security preferences`
    );

    if (usersWithoutPreferences.length === 0) {
      logger.info('No users need security preferences migration');
      return;
    }

    // Update each user with default security preferences
    const updatePromises = usersWithoutPreferences.map(user => {
      return User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            securityPreferences: {
              loginAlerts: false, // Default to false to avoid spam
            },
          },
        },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    logger.info(
      `Successfully added security preferences to ${usersWithoutPreferences.length} users`
    );

    // Verify the migration
    const usersStillWithoutPreferences = await User.find({
      $or: [
        { securityPreferences: { $exists: false } },
        { securityPreferences: null },
      ],
    });

    if (usersStillWithoutPreferences.length === 0) {
      logger.info(
        '✅ Migration completed successfully - all users now have security preferences'
      );
    } else {
      logger.warn(
        `⚠️ Migration completed with warnings - ${usersStillWithoutPreferences.length} users still missing security preferences`
      );
    }
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  }
}

module.exports = addSecurityPreferences;
