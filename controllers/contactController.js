const ContactService = require('../services/contactService');
const { AppError } = require('../middleware/errorHandler');
const BandsyteEmailService = require('../services/bandsyteEmailService');
const themeService = require('../services/themeService');
const logger = require('../utils/logger');

/**
 * Get contact information
 */
async function getContactInfo(req, res, next) {
  try {
    const info = await ContactService.getContactInfo();
    res.status(200).json({
      success: true,
      data: info,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch contact information:', error);
    next(error);
  }
}

/**
 * Update contact information
 */
async function updateContact(req, res, next) {
  try {
    const updatedInfo = req.body;
    const result = await ContactService.updateContact(updatedInfo);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to update contact information:', error);
    next(error);
  }
}

/**
 * Send contact form message
 */
async function sendMessage(req, res, next) {
  try {
    const { name, email, title, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return next(new AppError('Name, email, and message are required', 400));
    }

    // Get the actual band name from theme
    const theme = await themeService.getTheme();
    const bandName = theme.siteTitle || 'Bandsyte';

    // Send notification email to admin
    const contactData = { name, email, title, message };
    await BandsyteEmailService.sendContactNotificationWithBranding(
      process.env.ADMIN_EMAIL || 'admin@bandsyte.com',
      contactData,
      bandName
    );

    logger.info(
      `📧 Contact form submitted by ${name} (${email}) - Subject: ${
        title || 'No subject'
      }`
    );

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    logger.error('❌ Contact form submission failed:', error);
    next(error);
  }
}

module.exports = {
  getContactInfo,
  updateContact,
  sendMessage,
};
