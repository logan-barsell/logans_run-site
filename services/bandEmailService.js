const Theme = require('../models/Theme');
const { sendNewsletterConfirmation } = require('./emailService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get email configuration for a band
 * @param {string} bandId - Band identifier
 * @returns {Object} Email configuration
 */
async function getBandEmailConfig(bandId = null) {
  try {
    // For MVP, use default bandsyte.com configuration
    // In the future, this could be band-specific
    const config = {
      fromDomain: 'bandsyte.com',
      fromEmail: 'noreply@bandsyte.com',
      webhookUrl: `${
        process.env.CLIENT_URL || 'http://localhost:3000'
      }/api/ses/notifications`,
      verifiedDomain: 'bandsyte.com',
    };

    // If bandId provided, get band-specific settings from theme
    if (bandId) {
      const theme = await Theme.findOne({ bandId });
      if (theme) {
        config.bandName = theme.siteTitle || 'Bandsyte';
        config.customDomain = theme.customDomain; // For future use
      }
    }

    return config;
  } catch (error) {
    logger.error('❌ Failed to get band email config:', error);
    throw new AppError(
      error.message || 'Failed to get band email config',
      error.statusCode || 500
    );
  }
}

/**
 * Generate white-label FROM address for a band
 * @param {string} bandName - Band name
 * @returns {string} Formatted FROM address
 */
function generateFromAddress(bandName) {
  const baseEmail = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // Format: Band Name <noreply@bandsyte.com>
  // This gives white-label appearance while using verified domain
  return `${bandName} <${baseEmail}>`;
}

/**
 * Send newsletter confirmation with band branding
 * @param {string} email - Subscriber email (used for both sending and display)
 * @param {string} bandName - Band name
 * @param {string} unsubscribeToken - Unsubscribe token
 */
async function sendNewsletterConfirmationWithBranding(
  email,
  bandName,
  unsubscribeToken
) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(
      `📧 Sending newsletter confirmation for ${bandName} to ${email}`
    );

    return await sendNewsletterConfirmation(
      email,
      bandName,
      unsubscribeToken,
      fromAddress
    );
  } catch (error) {
    logger.error(
      `❌ Failed to send newsletter confirmation for ${bandName}:`,
      error
    );
    throw new AppError(
      error.message || 'Failed to send newsletter confirmation',
      error.statusCode || 500
    );
  }
}

/**
 * Send welcome email with band branding
 * @param {string} email - User email
 * @param {string} bandName - Band name
 */
async function sendWelcomeEmailWithBranding(email, bandName) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(`📧 Sending welcome email for ${bandName} to ${email}`);

    return await sendWelcomeEmail(email, bandName, fromAddress);
  } catch (error) {
    logger.error(`❌ Failed to send welcome email for ${bandName}:`, error);
    throw new AppError(
      error.message || 'Failed to send welcome email',
      error.statusCode || 500
    );
  }
}

/**
 * Send content notification with band branding
 * @param {string} subscriberEmail - Subscriber email
 * @param {string} bandName - Band name
 * @param {string} contentType - Type of content ('music', 'video', 'show')
 * @param {Object} content - Content data
 * @param {string} unsubscribeToken - Unsubscribe token
 */
async function sendContentNotificationWithBranding(
  subscriberEmail,
  bandName,
  contentType,
  content,
  unsubscribeToken
) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(
      `📧 Sending ${contentType} notification for ${bandName} to ${subscriberEmail}`
    );

    return await sendContentNotification(
      subscriberEmail,
      bandName,
      contentType,
      content,
      unsubscribeToken,
      fromAddress
    );
  } catch (error) {
    logger.error(
      `❌ Failed to send ${contentType} notification for ${bandName}:`,
      error
    );
    throw new AppError(
      error.message || `Failed to send ${contentType} notification`,
      error.statusCode || 500
    );
  }
}

/**
 * Validate domain for SES usage
 * @param {string} domain - Domain to validate
 * @returns {boolean} Whether domain is valid for SES
 */
function validateDomainForSES(domain) {
  // Basic domain validation
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!domainRegex.test(domain)) {
    return false;
  }

  // For MVP, only allow bandsyte.com and its subdomains
  // In the future, this could validate against a whitelist of verified domains
  const allowedDomains = ['bandsyte.com'];
  const allowedPatterns = allowedDomains.map(d => new RegExp(`^(.+\\.)?${d}$`));

  return allowedPatterns.some(pattern => pattern.test(domain));
}

/**
 * Get SES configuration status for a band
 * @param {string} bandId - Band identifier
 * @returns {Object} SES configuration status
 */
async function getSESStatus(bandId = null) {
  try {
    const config = await getBandEmailConfig(bandId);

    return {
      bandId,
      verifiedDomain: config.verifiedDomain,
      fromEmail: config.fromEmail,
      webhookConfigured: !!config.webhookUrl,
      domainValid: validateDomainForSES(config.verifiedDomain),
      whiteLabelReady: true, // Hybrid approach is always ready
      configurationType: 'hybrid', // bandsyte.com envelope, custom display name
    };
  } catch (error) {
    logger.error('❌ Failed to get SES status:', error);
    return {
      error: error.message,
      configured: false,
    };
  }
}

module.exports = {
  getBandEmailConfig,
  generateFromAddress,
  sendNewsletterConfirmationWithBranding,
  sendWelcomeEmailWithBranding,
  sendContentNotificationWithBranding,
  validateDomainForSES,
  getSESStatus,
};
