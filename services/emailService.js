const logger = require('../utils/logger');

/**
 * Simple email service for development
 * In production, you would integrate with a real email service like SendGrid, AWS SES, etc.
 */

/**
 * Sends an email (currently just logs for development)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
async function sendEmail(to, subject, html) {
  // In development, just log the email
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`📧 Email would be sent to ${to}:`);
    logger.info(`Subject: ${subject}`);
    logger.info(`Content: ${html}`);
    return;
  }

  // TODO: Implement real email service integration
  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // await sgMail.send({ to, from: process.env.FROM_EMAIL, subject, html })

  logger.info(`📧 Email sent to ${to}: ${subject}`);
}

module.exports = {
  sendEmail,
};
