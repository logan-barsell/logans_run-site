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
 * @returns {Object} Template with subject and HTML
 */
const securityAlert = (
  bandName = 'Bandsyte',
  alertType = 'suspicious_activity',
  timestamp = new Date().toLocaleString(),
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown',
  theme = {}
) => {
  const getAlertTitle = type => {
    switch (type) {
      case 'token_reuse':
        return 'Suspicious Token Activity Detected';
      case 'device_change':
        return 'Login from New Device/Location';
      case 'suspicious_activity':
        return 'Security Alert';
      default:
        return 'Security Alert';
    }
  };

  const getAlertMessage = type => {
    switch (type) {
      case 'token_reuse':
        return 'We detected an attempt to reuse an expired security token. This could indicate a security breach.';
      case 'device_change':
        return 'Your account was accessed from a new device or location. If this was you, no action is needed.';
      case 'suspicious_activity':
        return 'We detected unusual activity on your account that may require your attention.';
      default:
        return 'We detected unusual activity on your account.';
    }
  };

  const getActionRequired = type => {
    switch (type) {
      case 'token_reuse':
        return 'We have automatically secured your account by ending all active sessions. Please log in again.';
      case 'device_change':
        return 'If this was not you, please change your password immediately and contact support.';
      case 'suspicious_activity':
        return 'Please review your account activity and contact support if you notice anything unusual.';
      default:
        return 'Please review your account activity.';
    }
  };

  return {
    subject: `Security Alert - ${bandName} Admin`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert - ${bandName} Admin</title>
      ${
        theme.bandLogoUrl
          ? `
      <meta property="og:image" content="${theme.bandLogoUrl}" />
      <meta name="twitter:image" content="${theme.bandLogoUrl}" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" type="image/png" href="${theme.bandLogoUrl}" />
      `
          : ''
      }
      <style>
        body { font-family: "Courier New", monospace; line-height: 1.6; color: #333 !important; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000000; color: white !important; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; color: #333 !important; }
        .content p { color: #333 !important; }
        .content h2 { color: #333 !important; }
        .content strong { color: #333 !important; }
        .footer { text-align: center; margin-top: 30px; color: #333 !important; font-size: 14px; }
        .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #721c24 !important; }
        .alert p { color: #721c24 !important; }
        .alert strong { color: #721c24 !important; }
        .info { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #0c5460 !important; }
        .info p { color: #0c5460 !important; }
        .info strong { color: #0c5460 !important; }
        .bandsyte-brand { background: #000000; color: white !important; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${
            theme.bandLogoUrl
              ? `<img src="${theme.bandLogoUrl}" alt="${bandName} Logo" style="max-height: 130px; height: auto; width: auto;" />`
              : ''
          }
          <h1>${bandName}</h1>
          <p>🚨 Security Alert</p>
        </div>
        <div class="content">
          <h2>${getAlertTitle(alertType)}</h2>
          <p>Hey <strong>${bandName}</strong> admin,</p>
          <p>${getAlertMessage(alertType)}</p>
          
          <div class="alert">
            <p><strong>⚠️ Action Required:</strong> ${getActionRequired(
              alertType
            )}</p>
          </div>
          
          <div class="info">
            <p><strong>📊 Activity Details:</strong></p>
            <ul>
              <li><strong>Time:</strong> ${timestamp}</li>
              <li><strong>IP Address:</strong> ${ipAddress}</li>
              <li><strong>Device:</strong> ${userAgent}</li>
              <li><strong>Location:</strong> ${location}</li>
            </ul>
          </div>
          
          <p>If you have any questions or concerns about this security alert, please contact our support team immediately.</p>
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This security notification was sent by your Bandsyte website platform.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${bandName}. All rights reserved.</p>
          <p>Website powered by <strong>Bandsyte</strong>.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  };
};

module.exports = securityAlert;
