const ContactInfo = require('../models/ContactInfo');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * URL validation patterns matching frontend validation exactly
 */
const VALIDATION_PATTERNS = {
  facebook: [
    /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?fb\.com\/[^\/]+/,
  ],
  instagram: [
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?ig\.com\/[^\/]+/,
  ],
  tiktok: [
    /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?vm\.tiktok\.com\/[^\/]+/,
  ],
  youtube: [
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/[a-zA-Z0-9_-]+/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/[a-zA-Z0-9_-]+/,
    /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/[a-zA-Z0-9_-]+/,
  ],
  soundcloud: [/^(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/[^\/]+/],
  spotify: [
    /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|album|playlist|artist|episode|show)\/[a-zA-Z0-9]{22}/,
    /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/user\/[^\/]+/,
  ],
  appleMusic: [
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/(?:album|playlist)\/[^\/]+\/\d+/,
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/album\/[^\/]+\/\d+\?i=\d+/,
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/artist\/[^\/]+\/\d+/,
  ],
  x: [
    /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[^\/]+/,
    /^(?:https?:\/\/)?(?:www\.)?x\.com\/[^\/]+/,
  ],
};

/**
 * Validate social media URLs using regex patterns matching frontend validation
 */
function validateSocialUrls(contactData) {
  const socialFields = [
    'facebook',
    'instagram',
    'youtube',
    'soundcloud',
    'spotify',
    'appleMusic',
    'x',
    'tiktok',
  ];

  for (const field of socialFields) {
    if (contactData[field] && contactData[field].trim()) {
      const url = contactData[field].trim();

      // Basic URL format validation
      try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
      } catch (error) {
        throw new AppError(`Invalid ${field} URL format`, 400);
      }

      // Platform-specific validation using regex patterns
      const patterns = VALIDATION_PATTERNS[field];
      const isValid = patterns.some(pattern => pattern.test(url));

      if (!isValid) {
        throw new AppError(
          `Invalid ${field} URL - must be a valid ${field} URL format`,
          400
        );
      }
    }
  }
}

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

    // Validate all social media URLs before saving
    validateSocialUrls(updatedInfo);

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
