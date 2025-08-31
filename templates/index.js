/**
 * Email Templates Index
 *
 * This file exports all email templates for easy importing.
 * Each template is in its own file for better organization and maintainability.
 */

const emailVerification = require('./emailVerification');
const passwordReset = require('./passwordReset');
const passwordResetSuccess = require('./passwordResetSuccess');
const welcomeEmail = require('./welcomeEmail');
const contactNotification = require('./contactNotification');
const newsletterConfirmation = require('./newsletterConfirmation');
const newsletterSignupNotification = require('./newsletterSignupNotification');
const twoFactorCode = require('./twoFactorCode');
const loginAlert = require('./loginAlert');
const securityAlert = require('./securityAlert');

module.exports = {
  emailVerification,
  passwordReset,
  passwordResetSuccess,
  welcomeEmail,
  contactNotification,
  newsletterConfirmation,
  newsletterSignupNotification,
  twoFactorCode,
  loginAlert,
  securityAlert,
};
