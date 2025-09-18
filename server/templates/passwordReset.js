const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Password Reset Template
 *
 * Used for:
 * - Password reset requests
 * - Security-related email communications
 *
 * @param {string} resetLink - The password reset URL
 * @param {string} bandName - Band name for branding
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const passwordReset = (
  resetLink,
  bandName = 'Bandsyte',
  theme = {},
  config
) => {
  const subject = `Reset Your Password - ${bandName} Admin`;

  const content = `
    <h2>🔐 Let's Get You Back In</h2>
    <p>Hey <strong>${bandName}</strong> admin,</p>
    <p>Looks like you need to reset your password for your website. No worries, we've got you covered!</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </div>
    <div class="warning">
      <strong>Heads up:</strong> This link expires in 1 hour for security.
    </div>
    <div class="security">
      <strong>Security check:</strong> If you didn't request this reset, just ignore this email. Your password stays the same.
    </div>
    <p>If the button doesn't work, copy and paste this link:</p>
    <p style="word-break: break-all; color: #e74c3c;">${resetLink}</p>
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    'Password Reset',
    content,
    theme,
    config
  );
};

module.exports = passwordReset;
