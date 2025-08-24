const ContactInfo = require('../models/ContactInfo');
const logger = require('../utils/logger');

class ContactService {
  /**
   * Get public contact information
   */
  async getContactInfo() {
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
      logger.error('Error fetching contact info:', error);
      throw error;
    }
  }

  /**
   * Update public contact information
   */
  async updateContact(updatedInfo) {
    try {
      let contactInfo = await ContactInfo.findOne();

      if (!contactInfo) {
        // Create new contact info if it doesn't exist
        contactInfo = new ContactInfo(updatedInfo);
        await contactInfo.save();
      } else {
        // Replace the entire document to remove old fields
        await ContactInfo.findByIdAndReplace(contactInfo._id, updatedInfo, {
          new: true,
          runValidators: true,
        });
        contactInfo = await ContactInfo.findById(contactInfo._id);
      }

      logger.info('Contact info updated successfully');
      return contactInfo;
    } catch (error) {
      logger.error('Error updating contact info:', error);
      throw error;
    }
  }
}

module.exports = new ContactService();
