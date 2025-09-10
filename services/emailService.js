const logger = require('../utils/logger');
const emailTemplates = require('../templates');
const ThemeService = require('./themeService');
const { AppError } = require('../middleware/errorHandler');
const sesThrottler = require('../utils/sesThrottler');

// AWS SES throttling is handled by sesThrottler utility

/**
 * Sends an email using AWS SES or logs in development
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @param {string} templateType - Type of template to use (optional)
 * @param {Object} templateData - Data for template (optional)
 */
async function sendEmail(
  to,
  subject,
  html,
  templateType = null,
  templateData = {},
  customFromAddress = null,
  tenantId = null
) {
  try {
    // In development without AWS credentials, just log the email
    if (
      process.env.NODE_ENV !== 'production' &&
      (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
    ) {
      logger.info(
        `📧 Email logged (development): ${to} - ${subject || 'Template email'}`
      );
      return { success: true, message: 'Email logged (development mode)' };
    }

    // Use template if specified
    if (templateType && emailTemplates[templateType]) {
      let template;

      // Fetch theme data for email styling
      let theme = null;
      try {
        theme = tenantId ? await ThemeService.getTheme(tenantId) : null;
      } catch (error) {
        logger.warn('Could not fetch theme for email template:', error.message);
      }

      // Handle different template parameter patterns
      if (templateType === 'contactNotification') {
        template = emailTemplates[templateType](
          templateData.contactData,
          templateData.bandName,
          theme
        );
      } else if (templateType === 'welcomeEmail') {
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.dashboardUrl
        );
      } else if (templateType === 'newsletterConfirmation') {
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.email,
          templateData.unsubscribeToken,
          theme
        );
      } else if (templateType === 'newsletterSignupNotification') {
        template = emailTemplates[templateType](
          templateData.fanEmail,
          templateData.bandName,
          theme
        );
      } else if (templateType === 'passwordReset') {
        // Password reset template needs link, bandName, and theme
        template = emailTemplates[templateType](
          templateData.link,
          templateData.bandName,
          theme
        );
      } else if (templateType === 'passwordResetSuccess') {
        // Password reset success template needs bandName, timestamp, and theme
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.timestamp,
          theme
        );
      } else if (templateType === 'loginAlert') {
        // Login alert template needs bandName, timestamp, ipAddress, userAgent, location, theme
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.timestamp,
          templateData.ipAddress,
          templateData.userAgent,
          templateData.location,
          theme
        );
      } else if (templateType === 'securityAlert') {
        // Security alert template needs bandName, alertType, timestamp, ipAddress, userAgent, location, theme
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.alertType,
          templateData.timestamp,
          templateData.ipAddress,
          templateData.userAgent,
          templateData.location,
          theme
        );
      } else if (templateType === 'twoFactorCode') {
        // Two-factor code template needs code, bandName, and theme
        template = emailTemplates[templateType](
          templateData.code,
          templateData.bandName,
          theme
        );
      } else if (templateType === 'newsletterNotification') {
        // Newsletter notification template needs bandName, content, contentType, unsubscribeToken, theme
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.content,
          templateData.contentType,
          templateData.unsubscribeToken,
          theme
        );
      } else if (templateType === 'musicNotification') {
        // Music notification template needs bandName, content, theme, unsubscribeToken
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.content,
          theme,
          templateData.unsubscribeToken
        );
      } else if (templateType === 'videoNotification') {
        // Video notification template needs bandName, content, theme, unsubscribeToken
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.content,
          theme,
          templateData.unsubscribeToken
        );
      } else if (templateType === 'showNotification') {
        // Show notification template needs bandName, content, theme, unsubscribeToken
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.content,
          theme,
          templateData.unsubscribeToken
        );
      } else {
        // Default pattern for emailVerification
        template = emailTemplates[templateType](
          templateData.link,
          templateData.role,
          templateData.bandName,
          theme
        );
      }

      subject = template.subject;
      html = template.html;
    }

    // Use SES throttler for production, log for development
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      // Queue email with throttler for proper rate limiting
      await sesThrottler.queueEmail({
        to,
        subject,
        html,
        from: customFromAddress,
      });

      return { success: true, message: 'Email queued for sending' };
    }

    // Fallback for development
    logger.info(`📧 Email logged (no AWS credentials): ${to} - ${subject}`);
    return { success: true, message: 'Email logged (no AWS credentials)' };
  } catch (error) {
    logger.error('❌ Email sending failed:', error);
    throw new AppError(
      error.message || 'Failed to send email',
      error.statusCode || 500
    );
  }
}

/**
 * Send email verification with professional template
 */
async function sendEmailVerification(
  to,
  verificationLink,
  role = 'USER',
  bandName = 'Bandsyte',
  customFromAddress = null,
  tenantId = null
) {
  const subject =
    role === 'ADMIN' || role === 'SUPERADMIN'
      ? `Join the ${bandName} Crew - Admin Invitation`
      : `Verify Your Email - ${bandName} Admin`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'emailVerification',
    {
      link: verificationLink,
      role,
      bandName,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send password reset with professional template
 */
async function sendPasswordReset(
  to,
  resetLink,
  bandName = 'Bandsyte',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `Reset Your Password - ${bandName} Admin`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'passwordReset',
    {
      link: resetLink,
      bandName,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send welcome email with professional template
 */
async function sendWelcomeEmail(
  to,
  bandName = 'Bandsyte',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `Welcome to Bandsyte - ${bandName} Website is Live!`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'welcomeEmail',
    {
      bandName,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send contact form notification
 */
async function sendContactNotification(
  to,
  contactData,
  bandName = 'Bandsyte',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `New Fan Message - ${bandName}`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'contactNotification',
    {
      contactData,
      bandName,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send newsletter confirmation
 */
async function sendNewsletterConfirmation(
  email,
  bandName = 'Bandsyte',
  unsubscribeToken = '',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `You're In The Loop - ${bandName} Newsletter`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    email,
    subject,
    null,
    'newsletterConfirmation',
    {
      email,
      bandName,
      unsubscribeToken,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send newsletter signup notification to band
 */
async function sendNewsletterSignupNotification(
  to,
  fanEmail,
  bandName = 'Bandsyte',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `New Newsletter Signup - ${bandName}`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'newsletterSignupNotification',
    {
      fanEmail,
      bandName,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send content notification with professional template
 */
async function sendContentNotification(
  to,
  bandName = 'Bandsyte',
  contentType = 'content',
  content = {},
  unsubscribeToken = '',
  customFromAddress = null,
  tenantId = null
) {
  // Determine the appropriate template based on content type
  let templateType = 'newsletterNotification'; // Default fallback

  switch (contentType) {
    case 'music':
      templateType = 'musicNotification';
      break;
    case 'video':
      templateType = 'videoNotification';
      break;
    case 'show':
      templateType = 'showNotification';
      break;
    default:
      templateType = 'newsletterNotification';
  }

  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    null, // Subject will be generated by the template
    null, // HTML will be generated by the template
    templateType,
    {
      bandName,
      content,
      contentType,
      unsubscribeToken,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Get content notification subject
 */
function getContentNotificationSubject(contentType, bandName) {
  switch (contentType) {
    case 'music':
      return `🎵 New Music Released - ${bandName}`;
    case 'video':
      return `🎬 New Video Uploaded - ${bandName}`;
    case 'show':
      return `🎤 New Show Added - ${bandName}`;
    default:
      return `📢 New Content Added - ${bandName}`;
  }
}

/**
 * Send password reset success notification
 */
async function sendPasswordResetSuccess(
  to,
  bandName = 'Bandsyte',
  timestamp = new Date().toLocaleString(),
  customFromAddress = null,
  tenantId = null
) {
  const subject = `Password Reset Successful - ${bandName} Admin`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'passwordResetSuccess',
    {
      bandName,
      timestamp,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send security alert notification
 */
async function sendSecurityAlert(
  to,
  bandName = 'Bandsyte',
  alertType = 'suspicious_activity',
  timestamp = new Date().toLocaleString(),
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `Security Alert - ${bandName} Admin`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'securityAlert',
    {
      bandName,
      alertType,
      timestamp,
      ipAddress,
      userAgent,
      location,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send login alert notification
 */
async function sendLoginAlert(
  to,
  bandName = 'Bandsyte',
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `Login Alert - ${bandName} Admin`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'loginAlert',
    {
      bandName,
      timestamp: new Date().toLocaleString(),
      ipAddress,
      userAgent,
      location,
    },
    fromAddress,
    tenantId
  );
}

/**
 * Send two-factor authentication code
 */
async function sendTwoFactorCode(
  to,
  code,
  bandName = 'Bandsyte',
  customFromAddress = null,
  tenantId = null
) {
  const subject = `Two-Factor Authentication Code - ${bandName} Admin`;
  let fromAddress = process.env.FROM_EMAIL || 'noreply@bandsyte.com';

  // If custom from address provided, use it directly (already formatted)
  if (customFromAddress) {
    fromAddress = customFromAddress;
  }

  return sendEmail(
    to,
    subject,
    null,
    'twoFactorCode',
    {
      code,
      bandName,
    },
    fromAddress,
    tenantId
  );
}

module.exports = {
  sendEmail,
  sendEmailVerification,
  sendPasswordReset,
  sendPasswordResetSuccess,
  sendWelcomeEmail,
  sendContactNotification,
  sendNewsletterConfirmation,
  sendNewsletterSignupNotification,
  sendContentNotification,
  sendSecurityAlert,
  sendLoginAlert,
  sendTwoFactorCode,
};
