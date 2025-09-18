const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Two-Factor Authentication Code Template
 *
 * Used for:
 * - Sending 2FA codes to users
 * - Security verification emails
 *
 * @param {string} code - The 2FA verification code
 * @param {string} bandName - Band name for branding
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const twoFactorCode = (code, bandName = 'Bandsyte', theme = {}, config) => {
  const subject = `Your Security Code - ${bandName} Admin`;

  const content = `
    <h2>🔐 Your Security Code</h2>
    <p>Hey <strong>${bandName}</strong> admin,</p>
    <p>Here's your two-factor authentication code to complete your login:</p>
    
    <div class="code-display">${code}</div>
    
    <div class="warning">
      <strong>Quick note:</strong> This code expires in 10 minutes for security.
    </div>
    
    <div class="security">
      <strong>Security check:</strong> If you didn't request this code, someone might be trying to access your account. Please secure your account immediately.
    </div>
    
    <p>Enter this code in your login screen to continue.</p>
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    'Security Verification',
    content,
    theme,
    config
  );
};

module.exports = twoFactorCode;
