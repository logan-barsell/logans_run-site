const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Security Alert Template
 *
 * Used for:
 * - Suspicious login attempts
 * - Token reuse detection
 * - Device/IP changes
 * - Security events that require user attention
 *
 * @param {string} bandName - Band name for branding
 * @param {string} alertType - Type of security alert
 * @param {string} timestamp - When the alert occurred
 * @param {string} ipAddress - IP address of the suspicious activity
 * @param {string} userAgent - Device/browser information
 * @param {string} location - Approximate location (if available)
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const securityAlert = (
  bandName = 'Bandsyte',
  alertType = 'suspicious_activity',
  timestamp = new Date().toLocaleString(),
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown',
  theme = {},
  config
) => {
  const getAlertTitle = type => {
    switch (type) {
      case 'token_reuse':
        return 'Suspicious Token Activity Detected';
      case 'multiple_failed_logins':
        return 'Multiple Failed Login Attempts';
      case 'unusual_location':
        return 'Login from Unusual Location';
      case 'device_change':
        return 'New Device Detected';
      default:
        return 'Security Alert';
    }
  };

  const getAlertDescription = type => {
    switch (type) {
      case 'token_reuse':
        return 'We detected that a security token was used multiple times, which may indicate suspicious activity.';
      case 'multiple_failed_logins':
        return 'We noticed multiple failed login attempts on your account. This could indicate someone is trying to access your account.';
      case 'unusual_location':
        return "A login was detected from an unusual location. If this wasn't you, please secure your account immediately.";
      case 'device_change':
        return "A login was detected from a new device. If this wasn't you, please secure your account immediately.";
      default:
        return 'We detected unusual activity on your account. Please review the details below.';
    }
  };

  const subject = `${getAlertTitle(alertType)} - ${bandName} Admin`;

  const content = `
    <h2>🚨 ${getAlertTitle(alertType)}</h2>
    <p>Hey <strong>${bandName}</strong> admin,</p>
    <p>${getAlertDescription(alertType)}</p>
    
    <div class="highlight">
      <p><strong>Alert Time:</strong> ${timestamp}</p>
      <p><strong>IP Address:</strong> ${ipAddress}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Device:</strong> ${userAgent}</p>
    </div>
    
    <div class="warning">
      <strong>Important:</strong> If this activity wasn't authorized by you, please change your password immediately and enable two-factor authentication.
    </div>
    
    <div class="security">
      <strong>Security tip:</strong> Always use strong, unique passwords and enable two-factor authentication for better account security.
    </div>
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    getAlertTitle(alertType),
    content,
    theme,
    config
  );
};

module.exports = securityAlert;
