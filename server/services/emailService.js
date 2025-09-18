const logger = require('../utils/logger');
const emailTemplates = require('../templates');
const ThemeService = require('./themeService');
const { AppError } = require('../middleware/errorHandler');
const sesThrottler = require('../utils/sesThrottler');
const { getConfig } = require('../config/app');
const { minify } = require('html-minifier-terser');

// AWS SES throttling is handled by sesThrottler utility

/**
 * Sends an email using AWS SES or logs in development
 * @param {string|Array} to - Recipient email(s) - single email (string) or multiple emails (array)
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
    // DEV mode check - send only to ADMIN_EMAIL regardless of input
    if (process.env.NODE_ENV !== 'production') {
      to = process.env.ADMIN_EMAIL || 'admin@bandsyte.com';
    }

    // Ensure to is always an array for consistent processing
    const recipients = Array.isArray(to) ? to : [to];

    // Validate that either templateType is provided, or both subject and html are provided
    if (!templateType && (!subject || !html)) {
      throw new AppError(
        'Either templateType must be provided, or both subject and html must be provided',
        400
      );
    }

    // In development without AWS credentials, just log the email
    if (
      process.env.NODE_ENV !== 'production' &&
      (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
    ) {
      logger.info(
        `📧 Email logged (development): ${recipients.join(', ')} - ${
          subject || 'Template email'
        }`
      );
      return { success: true, message: 'Email logged (development mode)' };
    }

    // Use template if specified
    if (templateType && emailTemplates[templateType]) {
      let template;

      // Fetch theme data for email styling
      let theme = null;
      let config = null;
      if (!tenantId) {
        throw new AppError('tenantId is required for themed emails', 400);
      }

      try {
        theme = await ThemeService.getTheme(tenantId);
        if (!theme) {
          throw new AppError('Theme configuration not found', 404);
        }

        // Fetch config for dynamic URLs
        config = await getConfig(tenantId);
      } catch (error) {
        logger.error(
          '❌ Failed to fetch theme or config for email template:',
          error
        );
        throw new AppError(
          `Failed to fetch theme or config data for email: ${error.message}`,
          500
        );
      }

      // Handle different template parameter patterns
      if (templateType === 'contactNotification') {
        template = emailTemplates[templateType](
          templateData.contactData,
          templateData.siteTitle || 'Bandsyte',
          theme,
          config
        );
      } else if (templateType === 'welcomeEmail') {
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.dashboardUrl,
          config
        );
      } else if (templateType === 'newsletterConfirmation') {
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.email,
          templateData.unsubscribeToken,
          theme,
          config
        );
      } else if (templateType === 'newsletterSignupNotification') {
        template = emailTemplates[templateType](
          templateData.fanEmail,
          templateData.siteTitle || 'Bandsyte',
          theme,
          config
        );
      } else if (templateType === 'passwordReset') {
        // Password reset template needs link, bandName, and theme
        template = emailTemplates[templateType](
          templateData.link,
          templateData.siteTitle || 'Bandsyte',
          theme,
          config
        );
      } else if (templateType === 'passwordResetSuccess') {
        // Password reset success template needs bandName, timestamp, and theme
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.timestamp,
          theme,
          config
        );
      } else if (templateType === 'loginAlert') {
        // Login alert template needs bandName, timestamp, ipAddress, userAgent, location, theme
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.timestamp,
          templateData.ipAddress,
          templateData.userAgent,
          templateData.location,
          theme,
          config
        );
      } else if (templateType === 'securityAlert') {
        // Security alert template needs bandName, alertType, timestamp, ipAddress, userAgent, location, theme
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.alertType,
          templateData.timestamp,
          templateData.ipAddress,
          templateData.userAgent,
          templateData.location,
          theme,
          config
        );
      } else if (templateType === 'twoFactorCode') {
        // Two-factor code template needs code, bandName, and theme
        template = emailTemplates[templateType](
          templateData.code,
          templateData.siteTitle || 'Bandsyte',
          theme,
          config
        );
      } else if (templateType === 'musicNotification') {
        // Music notification template needs bandName, content, theme, unsubscribeToken
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.content,
          theme,
          templateData.unsubscribeToken,
          config
        );
      } else if (templateType === 'videoNotification') {
        // Video notification template needs bandName, content, theme, unsubscribeToken
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.content,
          theme,
          templateData.unsubscribeToken,
          config
        );
      } else if (templateType === 'showNotification') {
        // Show notification template needs bandName, content, theme, unsubscribeToken
        template = emailTemplates[templateType](
          templateData.siteTitle || 'Bandsyte',
          templateData.content,
          theme,
          templateData.unsubscribeToken,
          config
        );
      } else {
        // Default pattern for emailVerification
        template = emailTemplates[templateType](
          templateData.link,
          templateData.role,
          templateData.siteTitle || 'Bandsyte',
          theme,
          config
        );
      }

      subject = template.subject;
      html = template.html;
    }

    // Minify HTML to reduce Gmail clipping
    if (html) {
      try {
        html = await minify(html, {
          removeComments: false, // Keep comments as requested
          collapseWhitespace: true,
          conservativeCollapse: true, // Safer for emails
          removeEmptyElements: false, // Keep empty elements for email compatibility
          removeAttributeQuotes: false, // Keep quotes for email safety
          minifyCSS: true,
          minifyJS: false, // Don't minify JS in emails
          caseSensitive: false,
          keepClosingSlash: true,
          removeRedundantAttributes: false, // Keep all attributes
          removeScriptTypeAttributes: false,
          removeStyleLinkTypeAttributes: false,
          useShortDoctype: false, // Keep full doctype
          ignoreCustomFragments: [
            // Preserve any special email fragments if needed
            /<!--.*?-->/g, // Keep HTML comments
          ],
        });

        logger.debug(`📧 HTML minified successfully. Size reduced.`);
      } catch (error) {
        logger.warn(
          '⚠️ HTML minification failed, using original HTML:',
          error.message
        );
        // Continue with unminified HTML - don't break email sending
      }
    }

    // Optional suppression prefilter (skip suppressed addresses)
    let filteredRecipients = recipients;
    if (process.env.SES_PREFILTER_SUPPRESSION === 'true') {
      try {
        const { isSuppressed } = require('./sesSuppression');
        const checks = await Promise.all(
          recipients.map(async r => ({
            email: r,
            suppressed: await isSuppressed(r),
          }))
        );
        filteredRecipients = checks
          .filter(c => !c.suppressed)
          .map(c => c.email);
        const suppressedCount = recipients.length - filteredRecipients.length;
        if (suppressedCount > 0) {
          logger.warn(
            `📧 Suppression prefilter skipped ${suppressedCount} address(es)`
          );
        }
        if (filteredRecipients.length === 0) {
          return {
            success: true,
            message: 'All recipients are suppressed; nothing to send',
          };
        }
      } catch (prefilterError) {
        logger.warn(
          '📧 Suppression prefilter failed; proceeding without it:',
          prefilterError.message
        );
      }
    }

    // Use SES throttler for production, log for development
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      // Queue email(s) with throttler for proper rate limiting
      const result = await sesThrottler.queueEmail({
        to: filteredRecipients,
        subject,
        html,
        from: customFromAddress,
      });

      return {
        success: true,
        message: 'Email(s) queued for sending',
        ...(Array.isArray(to) && result
          ? {
              batchResults: result,
              successful: result.successful,
              failed: result.failed,
              total: result.total,
            }
          : {}),
      };
    }

    // Fallback for development
    logger.info(
      `📧 Email logged (no AWS credentials): ${recipients.join(
        ', '
      )} - ${subject}`
    );
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
 * Send email verification to band with professional template
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
 * Send password reset to band with professional template
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
 * Send welcome email to band with professional template
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
 * Send contact form notification to band
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
 * Send newsletter confirmation to subscriber
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
 * Send content notification to subscriber(s) with professional template
 * @param {string|Array} to - Recipient email(s) - single email (string) or multiple emails (array)
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
  let templateType;

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
      throw new AppError(
        `Invalid content type: ${contentType}. Must be one of: music, video, show`,
        400
      );
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
 * Send password reset success notification to band
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
 * Send security alert notification to band
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
 * Send login alert notification to band
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
 * Send two-factor authentication code to band
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
