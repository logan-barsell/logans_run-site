const emailService = require('./emailService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Generate white-label FROM address for Bandsyte
 * @param {string} fromType - Type of email (support, noreply, etc.)
 * @returns {string} Formatted FROM address
 */
function generateBandsyteFromAddress(fromType = 'support') {
  const baseEmail = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // Format: Bandsyte <support@bandsyte.com>
  // This gives white-label appearance for Bandsyte emails to bands
  return `Bandsyte <${fromType}@bandsyte.com>`;
}

/**
 * Send newsletter signup notification to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} fanEmail - Fan email who signed up
 * @param {string} bandName - Band name
 */
async function sendNewsletterSignupNotificationWithBranding(
  to,
  fanEmail,
  bandName,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(
      `📧 Sending newsletter signup notification for ${bandName} to ${to}`
    );

    return await emailService.sendNewsletterSignupNotification(
      to,
      fanEmail,
      bandName,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(
      `❌ Failed to send newsletter signup notification for ${bandName}:`,
      error
    );
    throw new AppError(
      error.message || 'Failed to send newsletter signup notification',
      error.statusCode || 500
    );
  }
}

/**
 * Send security alert to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} bandName - Band name
 * @param {string} alertType - Type of alert
 * @param {string} timestamp - When the alert occurred
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent
 * @param {string} location - Location
 */
async function sendSecurityAlertWithBranding(
  to,
  bandName,
  alertType,
  timestamp,
  ipAddress,
  userAgent,
  location,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending security alert for ${bandName} to ${to}`);

    return await emailService.sendSecurityAlert(
      to,
      bandName,
      alertType,
      timestamp,
      ipAddress,
      userAgent,
      location,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(`❌ Failed to send security alert for ${bandName}:`, error);
    throw new AppError(
      error.message || 'Failed to send security alert',
      error.statusCode || 500
    );
  }
}

/**
 * Send password reset to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} resetLink - Password reset link
 * @param {string} bandName - Band name
 */
async function sendPasswordResetWithBranding(
  to,
  resetLink,
  bandName,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending password reset for ${bandName} to ${to}`);

    return await emailService.sendPasswordReset(
      to,
      resetLink,
      bandName,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(`❌ Failed to send password reset for ${bandName}:`, error);
    throw new AppError(
      error.message || 'Failed to send password reset',
      error.statusCode || 500
    );
  }
}

/**
 * Send password reset success to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} bandName - Band name
 * @param {string} timestamp - When the reset occurred
 */
async function sendPasswordResetSuccessWithBranding(
  to,
  bandName,
  timestamp,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending password reset success for ${bandName} to ${to}`);

    return await emailService.sendPasswordResetSuccess(
      to,
      bandName,
      timestamp,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(
      `❌ Failed to send password reset success for ${bandName}:`,
      error
    );
    throw new AppError(
      error.message || 'Failed to send password reset success',
      error.statusCode || 500
    );
  }
}

/**
 * Send email verification to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} verificationLink - Email verification link
 * @param {string} role - User role
 * @param {string} bandName - Band name
 */
async function sendEmailVerificationWithBranding(
  to,
  verificationLink,
  role,
  bandName,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending email verification for ${bandName} to ${to}`);

    return await emailService.sendEmailVerification(
      to,
      verificationLink,
      role,
      bandName,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(
      `❌ Failed to send email verification for ${bandName}:`,
      error
    );
    throw new AppError(
      error.message || 'Failed to send email verification',
      error.statusCode || 500
    );
  }
}

/**
 * Send contact notification to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {Object} contactData - Contact form data
 * @param {string} bandName - Band name
 */
async function sendContactNotificationWithBranding(
  to,
  contactData,
  bandName,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending contact notification for ${bandName} to ${to}`);

    return await emailService.sendContactNotification(
      to,
      contactData,
      bandName,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(
      `❌ Failed to send contact notification for ${bandName}:`,
      error
    );
    throw new AppError(
      error.message || 'Failed to send contact notification',
      error.statusCode || 500
    );
  }
}

/**
 * Send welcome email to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} bandName - Band name
 */
async function sendWelcomeEmailWithBranding(to, bandName, tenantId = null) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending welcome email for ${bandName} to ${to}`);

    return await emailService.sendWelcomeEmail(
      to,
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
 * Send login alert to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} bandName - Band name
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent
 * @param {string} location - Location
 */
async function sendLoginAlertWithBranding(
  to,
  bandName,
  ipAddress,
  userAgent,
  location,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending login alert for ${bandName} to ${to}`);

    return await emailService.sendLoginAlert(
      to,
      bandName,
      ipAddress,
      userAgent,
      location,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(`❌ Failed to send login alert for ${bandName}:`, error);
    throw new AppError(
      error.message || 'Failed to send login alert',
      error.statusCode || 500
    );
  }
}

/**
 * Send two-factor code to band with Bandsyte branding
 * @param {string} to - Band admin email
 * @param {string} code - Two-factor code
 * @param {string} bandName - Band name
 */
async function sendTwoFactorCodeWithBranding(
  to,
  code,
  bandName,
  tenantId = null
) {
  try {
    // Generate Bandsyte white-label FROM address
    const fromAddress = generateBandsyteFromAddress('support');

    logger.info(`📧 Sending two-factor code for ${bandName} to ${to}`);

    return await emailService.sendTwoFactorCode(
      to,
      code,
      bandName,
      fromAddress,
      tenantId
    );
  } catch (error) {
    logger.error(`❌ Failed to send two-factor code for ${bandName}:`, error);
    throw new AppError(
      error.message || 'Failed to send two-factor code',
      error.statusCode || 500
    );
  }
}

module.exports = {
  generateBandsyteFromAddress,
  sendNewsletterSignupNotificationWithBranding,
  sendSecurityAlertWithBranding,
  sendPasswordResetWithBranding,
  sendPasswordResetSuccessWithBranding,
  sendEmailVerificationWithBranding,
  sendContactNotificationWithBranding,
  sendWelcomeEmailWithBranding,
  sendLoginAlertWithBranding,
  sendTwoFactorCodeWithBranding,
};
