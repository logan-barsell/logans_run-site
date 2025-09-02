const ContactInfo = require('../models/ContactInfo');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get public contact information
 */
async function getContactInfo() {
  try {
    let contactInfo = await ContactInfo.findOne();

    // If no contact info exists, create default
    if (!contactInfo) {
      contactInfo = new ContactInfo({
        publicEmail: '',
        publicPhone: '',
        facebook: '',
        instagram: '',
        youtube: '',
        soundcloud: '',
        spotify: '',
        appleMusic: '',
        x: '',
        tiktok: '',
      });
      await contactInfo.save();
      logger.info('Default contact info created');
    }

    return contactInfo;
  } catch (error) {
    logger.error('❌ Error fetching contact info:', error);
    throw new AppError(
      error.message || 'Error fetching contact information',
      error.statusCode || 500
    );
  }
}

/**
 * Update public contact information
 */
async function updateContact(updatedInfo) {
  try {
    if (!updatedInfo) {
      throw new AppError('Contact information is required', 400);
    }

    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      // Create new contact info if it doesn't exist
      contactInfo = new ContactInfo(updatedInfo);
      await contactInfo.save();
    } else {
      // Replace the entire document to remove old fields
      await ContactInfo.findByIdAndUpdate(contactInfo._id, updatedInfo, {
        new: true,
        runValidators: true,
        overwrite: true, // This ensures old fields are removed
      });
      contactInfo = await ContactInfo.findById(contactInfo._id);
    }

    logger.info('✅ Contact info updated successfully');
    return contactInfo;
  } catch (error) {
    logger.error('❌ Error updating contact info:', error);
    throw new AppError(
      error.message || 'Error updating contact information',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getContactInfo,
  updateContact,
};
