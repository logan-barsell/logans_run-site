const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const logger = require('../utils/logger');
const config = require('../config');
const emailTemplates = require('../templates');
const Theme = require('../models/Theme');
const { getEmailColors } = require('../utils/colorPalettes');

// Initialize AWS SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
  templateData = {}
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
        theme = await Theme.findOne();
      } catch (error) {
        logger.warn('Could not fetch theme for email template:', error.message);
      }

      // Get email colors based on theme
      const emailColors = theme ? getEmailColors(theme) : getEmailColors({});

      // Handle different template parameter patterns
      if (templateType === 'contactNotification') {
        template = emailTemplates[templateType](
          templateData.contactData,
          templateData.bandName,
          emailColors
        );
      } else if (templateType === 'welcomeEmail') {
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.dashboardUrl,
          emailColors
        );
      } else if (templateType === 'newsletterConfirmation') {
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.email,
          templateData.unsubscribeToken,
          emailColors
        );
      } else if (templateType === 'newsletterSignupNotification') {
        template = emailTemplates[templateType](
          templateData.fanEmail,
          templateData.bandName,
          emailColors
        );
      } else if (templateType === 'passwordReset') {
        // Password reset template only needs link and bandName
        template = emailTemplates[templateType](
          templateData.link,
          templateData.bandName,
          emailColors
        );
      } else if (templateType === 'passwordResetSuccess') {
        // Password reset success template needs bandName and timestamp
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.timestamp,
          emailColors
        );
      } else if (templateType === 'loginAlert') {
        // Login alert template needs bandName, timestamp, ipAddress, userAgent, location
        template = emailTemplates[templateType](
          templateData.bandName,
          templateData.timestamp,
          templateData.ipAddress,
          templateData.userAgent,
          templateData.location
        );
      } else if (templateType === 'twoFactorCode') {
        // Two-factor code template needs code and bandName
        template = emailTemplates[templateType](
          templateData.code,
          templateData.bandName
        );
      } else {
        // Default pattern for emailVerification
        template = emailTemplates[templateType](
          templateData.link,
          templateData.role,
          templateData.bandName,
          emailColors
        );
      }

      subject = template.subject;
      html = template.html;
    }

    // Send via AWS SES
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      const params = {
        Source: process.env.FROM_EMAIL || 'noreply@bandsyte.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
      };

      const command = new SendEmailCommand(params);
      await sesClient.send(command);

      logger.info(`📧 Email sent successfully to ${to}: ${subject}`);
      return { success: true, message: 'Email sent successfully' };
    }

    // Fallback for development
    logger.info(`📧 Email logged (no AWS credentials): ${to} - ${subject}`);
    return { success: true, message: 'Email logged (no AWS credentials)' };
  } catch (error) {
    logger.error('❌ Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send email verification with professional template
 */
async function sendEmailVerification(
  to,
  verificationLink,
  role = 'USER',
  bandName = 'Bandsyte'
) {
  return sendEmail(to, null, null, 'emailVerification', {
    link: verificationLink,
    role,
    bandName,
  });
}

/**
 * Send password reset with professional template
 */
async function sendPasswordReset(to, resetLink, bandName = 'Bandsyte') {
  return sendEmail(to, null, null, 'passwordReset', {
    link: resetLink,
    bandName,
  });
}

/**
 * Send welcome email with professional template
 */
async function sendWelcomeEmail(to, bandName = 'Bandsyte') {
  return sendEmail(to, null, null, 'welcomeEmail', {
    bandName,
  });
}

/**
 * Send contact form notification
 */
async function sendContactNotification(to, contactData, bandName = 'Bandsyte') {
  return sendEmail(to, null, null, 'contactNotification', {
    contactData,
    bandName,
  });
}

/**
 * Send newsletter confirmation
 */
async function sendNewsletterConfirmation(
  to,
  email,
  bandName = 'Bandsyte',
  unsubscribeToken = ''
) {
  return sendEmail(to, null, null, 'newsletterConfirmation', {
    email,
    bandName,
    unsubscribeToken,
  });
}

/**
 * Send newsletter signup notification to band
 */
async function sendNewsletterSignupNotification(
  to,
  fanEmail,
  bandName = 'Bandsyte'
) {
  return sendEmail(to, null, null, 'newsletterSignupNotification', {
    fanEmail,
    bandName,
  });
}

/**
 * Send password reset success notification
 */
async function sendPasswordResetSuccess(to, bandName = 'Bandsyte') {
  return sendEmail(to, null, null, 'passwordResetSuccess', {
    bandName,
    timestamp: new Date().toLocaleString(),
  });
}

/**
 * Send security alert notification
 */
async function sendSecurityAlert(
  to,
  bandName = 'Bandsyte',
  alertType = 'suspicious_activity',
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown'
) {
  return sendEmail(to, null, null, 'securityAlert', {
    bandName,
    alertType,
    timestamp: new Date().toLocaleString(),
    ipAddress,
    userAgent,
    location,
  });
}

/**
 * Send login alert notification
 */
async function sendLoginAlert(
  to,
  bandName = 'Bandsyte',
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown'
) {
  return sendEmail(to, null, null, 'loginAlert', {
    bandName,
    timestamp: new Date().toLocaleString(),
    ipAddress,
    userAgent,
    location,
  });
}

/**
 * Send two-factor authentication code
 */
async function sendTwoFactorCode(to, code, bandName = 'Bandsyte') {
  return sendEmail(to, null, null, 'twoFactorCode', {
    code,
    bandName,
  });
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
  sendSecurityAlert,
  sendLoginAlert,
  sendTwoFactorCode,
};
