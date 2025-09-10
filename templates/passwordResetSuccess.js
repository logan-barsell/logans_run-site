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
 * @returns {Object} Template with subject and HTML
 */
const passwordResetSuccess = (
  bandName = 'Bandsyte',
  timestamp = new Date().toLocaleString(),
  theme = {}
) => ({
  subject: `Password Reset Successful - ${bandName} Admin`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful - ${bandName} Admin</title>
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
        .security { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #0c5460 !important; }
        .security strong { color: #0c5460 !important; }
        .bandsyte-brand { background: #000000; color: white !important; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${
            theme && theme.bandLogoUrl
              ? `<img src="${theme.bandLogoUrl}" alt="${bandName} Logo" style="max-height: 130px; height: auto; width: auto;" />`
              : ''
          }
          <h1>${bandName}</h1>
          <p>Password Reset Successful</p>
        </div>
        <div class="content">
          <h2>🔐 Password Successfully Reset!</h2>
          <p>Hey <strong>${bandName}</strong> admin,</p>
          <p>Your password has been successfully reset and your account is secure.</p>
          
          <div class="success">
            <p><strong>✅ Reset completed:</strong> ${timestamp}</p>
            <p><strong>✅ Account status:</strong> Active and secure</p>
          </div>
          
          <div class="security">
            <strong>🔒 Security reminder:</strong>
            <ul>
              <li>Your new password is now active</li>
              <li>You can log in with your new password</li>
              <li>If you didn't reset your password, contact support immediately</li>
            </ul>
          </div>
          
          <p>You're all set to get back to managing your <strong>${bandName}</strong> website!</p>
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
});

module.exports = passwordResetSuccess;
