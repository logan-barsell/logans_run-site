const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Login Alert Template
 *
 * Used for:
 * - Notifying users of successful logins
 * - Login activity monitoring
 * - Account access notifications
 *
 * @param {string} bandName - Band name for branding
 * @param {string} timestamp - When the login occurred
 * @param {string} ipAddress - IP address of the login
 * @param {string} userAgent - Device/browser information
 * @param {string} location - Approximate location (if available)
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const loginAlert = (
  bandName = 'Bandsyte',
  timestamp = new Date().toLocaleString(),
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown',
  theme = {},
  config
) => {
  const subject = `Login Alert - ${bandName} Admin`;

  const content = `
    <h2>🔐 Login Alert</h2>
    <p>Hey <strong>${bandName}</strong> admin,</p>
    <p>We wanted to let you know about a recent login to your account:</p>
    
    <div class="highlight">
      <p><strong>Login Time:</strong> ${timestamp}</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Device:</strong> ${userAgent}</p>
    </div>
    
    <div class="security">
      <strong>Security check:</strong> If this wasn't you, please secure your account immediately by changing your password.
    </div>
    
    <p>Thanks for keeping your account secure!</p>
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    'Login Alert',
    content,
    theme,
    config
  );
};

module.exports = loginAlert;
