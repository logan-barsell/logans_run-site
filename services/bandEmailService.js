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
 * Send newsletter confirmation to subscriber with band branding
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
 * Send content notification to subscriber(s) with band branding
 * @param {string|Array} subscriberEmails - Subscriber email(s) - single email (string) or multiple emails (array)
 * @param {string} bandName - Band name
 * @param {string} contentType - Type of content ('music', 'video', 'show')
 * @param {Object} content - Content data
 * @param {string|Array} unsubscribeTokens - Unsubscribe token(s) - single token (string) or array of tokens
 * @param {string} tenantId - Tenant identifier
 */
async function sendContentNotificationWithBranding(
  subscriberEmails,
  bandName,
  contentType,
  content,
  unsubscribeTokens,
  tenantId = null
) {
  try {
    // Generate white-label FROM address
    const fromAddress = generateFromAddress(bandName);

    // Handle both single and multiple emails
    const emails = Array.isArray(subscriberEmails)
      ? subscriberEmails
      : [subscriberEmails];
    const tokens = Array.isArray(unsubscribeTokens)
      ? unsubscribeTokens
      : [unsubscribeTokens];

    // For batch emails, we need to handle unsubscribe tokens properly
    // If we have multiple emails but only one token, we need to handle this case
    if (emails.length > 1 && tokens.length === 1) {
      logger.warn(
        `📧 Multiple emails (${emails.length}) but single unsubscribe token provided. Using same token for all emails.`
      );
    }

    logger.info(
      `📧 Sending ${contentType} notification for ${bandName} to ${
        emails.length
      } recipient(s): ${emails.join(', ')}`
    );

    // For now, we'll send with the first token (or same token for all)
    // TODO: In the future, we might want to send individual emails per subscriber for personalized tokens
    const token = tokens[0];

    return await emailService.sendContentNotification(
      subscriberEmails, // Pass the original parameter (string or array)
      bandName,
      contentType,
      content,
      token,
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

module.exports = {
  getBandEmailConfig,
  generateFromAddress,
  sendNewsletterConfirmationWithBranding,
  sendContentNotificationWithBranding,
  validateDomainForSES,
  getSESStatus,
};
