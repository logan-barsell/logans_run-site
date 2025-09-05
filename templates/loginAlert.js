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
 * @returns {Object} Template with subject and HTML
 */
const loginAlert = (
  bandName = 'Bandsyte',
  timestamp = new Date().toLocaleString(),
  ipAddress = 'Unknown',
  userAgent = 'Unknown',
  location = 'Unknown',
  theme = {}
) => ({
  subject: `Login Alert - ${bandName} Admin`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Alert - ${bandName} Admin</title>
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
        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #155724 !important; }
        .success p { color: #155724 !important; }
        .success strong { color: #155724 !important; }
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
          <p>🔐 Login Alert</p>
        </div>
        <div class="content">
          <h2>Successful Login Detected</h2>
          <p>Hey <strong>${bandName}</strong> admin,</p>
          <p>We wanted to let you know that someone successfully logged into your admin account.</p>
          
          <div class="success">
            <p><strong>✅ Login Details:</strong></p>
            <ul>
              <li><strong>Time:</strong> ${timestamp}</li>
              <li><strong>IP Address:</strong> ${ipAddress}</li>
              <li><strong>Device:</strong> ${userAgent}</li>
              <li><strong>Location:</strong> ${location}</li>
            </ul>
          </div>
          
          <div class="info">
            <p><strong>ℹ️ What this means:</strong></p>
            <ul>
              <li>This was a successful login to your admin account</li>
              <li>If this was you, no action is needed</li>
              <li>If this was not you, please change your password immediately</li>
            </ul>
          </div>
          
          <p>If you have any concerns about this login activity, please contact our support team.</p>
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This login notification was sent by your Bandsyte website platform.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${bandName}. All rights reserved.</p>
          <p>Website powered by <strong>Bandsyte</strong>.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

module.exports = loginAlert;
