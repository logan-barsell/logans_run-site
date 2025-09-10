const ThemeService = require('./themeService');
const emailService = require('./emailService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get email configuration for a band
 * @param {string} tenantId - Tenant identifier
 * @returns {Object} Email configuration
 */
async function getBandEmailConfig(tenantId) {
  try {
    const theme = await ThemeService.getTheme(tenantId);
    if (!theme) {
      throw new AppError('Theme configuration not found', 404);
    }

    return {
      bandName: theme.siteTitle || 'Band',
      bandLogoUrl: theme.bandLogoUrl,
      primaryColor: theme.primaryColor || '#000000',
      secondaryColor: theme.secondaryColor || '#ffffff',
      enableNewsletter: theme.enableNewsletter || false,
      notifyOnNewShows: theme.notifyOnNewShows || false,
      notifyOnNewMusic: theme.notifyOnNewMusic || false,
      notifyOnNewVideos: theme.notifyOnNewVideos || false,
    };
  } catch (error) {
    logger.error('Failed to get band email config:', error);
    throw new AppError(
      error.message || 'Failed to get band email configuration',
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
  unsubscribeToken,
  tenantId = null
) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(
      `📧 Sending newsletter confirmation for ${bandName} to ${email}`
    );

    return await emailService.sendNewsletterConfirmation(
      email,
      bandName,
      unsubscribeToken,
      fromAddress,
      tenantId
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
async function sendWelcomeEmailWithBranding(email, bandName, tenantId = null) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(`📧 Sending welcome email for ${bandName} to ${email}`);

    return await emailService.sendWelcomeEmail(
      email,
      bandName,
      fromAddress,
      tenantId
    );
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
  unsubscribeToken,
  tenantId = null
) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(
      `📧 Sending ${contentType} notification for ${bandName} to ${subscriberEmail}`
    );

    return await emailService.sendContentNotification(
      subscriberEmail,
      bandName,
      contentType,
      content,
      unsubscribeToken,
      fromAddress,
      tenantId
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

  // Check for common invalid patterns
  const invalidPatterns = [
    /^localhost$/,
    /^127\.0\.0\.1$/,
    /^0\.0\.0\.0$/,
    /^[0-9]+$/,
  ];

  return !invalidPatterns.some(pattern => pattern.test(domain));
}

/**
 * Get SES status for a domain
 * @param {string} domain - Domain to check
 * @returns {Object} SES status information
 */
async function getSESStatus(domain) {
  try {
    // This would typically check AWS SES for domain verification status
    // For now, return a mock response
    return {
      domain,
      verified: true,
      configured: false,
    };
  } catch (error) {
    logger.error('Failed to get SES status:', error);
    return {
      domain,
      verified: false,
      configured: false,
    };
  }
}

/**
 * Send generic email with band branding
 * @param {Object} emailData - Email data object with to, subject, html
 * @param {string} bandName - Band name for FROM address
 */
async function sendEmailWithBranding(emailData, bandName, tenantId = null) {
  try {
    // Generate band white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    logger.info(`📧 Sending email for ${bandName} to ${emailData.to}`);

    // Call positional emailService API
    const to = emailData.to;
    const subject = emailData.subject || null;
    const html = emailData.html || null;
    return await emailService.sendEmail(
      to,
      subject,
      html,
      null,
      {},
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(`❌ Failed to send email for ${bandName}:`, error);
    throw new AppError(
      error.message || 'Failed to send email',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getBandEmailConfig,
  generateFromAddress,
  sendNewsletterConfirmationWithBranding,
  sendWelcomeEmailWithBranding,
  sendContentNotificationWithBranding,
  sendEmailWithBranding,
  validateDomainForSES,
  getSESStatus,
};
