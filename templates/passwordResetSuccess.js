const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Password Reset Success Template
 *
 * Used for:
 * - Confirming successful password reset
 * - Security notification to user
 * - Alerting user of account activity
 *
 * @param {string} bandName - Band name for branding
 * @param {string} timestamp - When the reset occurred
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const passwordResetSuccess = (
  bandName = 'Bandsyte',
  timestamp = new Date().toLocaleString(),
  theme = {},
  config
) => {
  const subject = `Password Reset Successful - ${bandName} Admin`;

  const content = `
    <h2>✅ Password Reset Successful</h2>
    <p>Hey <strong>${bandName}</strong> admin,</p>
    <p>Your password has been successfully reset!</p>
    
    <div class="highlight">
      <p><strong>Reset Time:</strong> ${timestamp}</p>
      <p><strong>Status:</strong> ✅ Completed Successfully</p>
    </div>
    
    <div class="security">
      <strong>Security check:</strong> If you didn't reset your password, someone may have accessed your account. Please contact support immediately.
    </div>
    
    <p>You can now log in with your new password. We recommend enabling two-factor authentication for additional security.</p>
    
    <div class="warning">
      <strong>Next steps:</strong> Make sure to update your password in any password managers or saved login forms you might have.
    </div>
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    'Password Reset Successful',
    content,
    theme,
    config
  );
};

module.exports = passwordResetSuccess;
