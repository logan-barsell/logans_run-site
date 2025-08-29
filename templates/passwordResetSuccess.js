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
 * @param {Object} colors - Theme colors for email styling
 * @returns {Object} Template with subject and HTML
 */
const passwordResetSuccess = (
  bandName = 'Bandsyte',
  timestamp = new Date().toLocaleString(),
  colors = {}
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
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${colors.header || '#27ae60'}; color: ${
    colors.headerText || 'white'
  }; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: ${
          colors.content || '#f9f9f9'
        }; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .security { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .bandsyte-brand { background: ${
          colors.footer || '#f8f9fa'
        }; border: 1px solid ${
    colors.border || '#dee2e6'
  }; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
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
