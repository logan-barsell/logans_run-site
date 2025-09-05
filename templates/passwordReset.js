/**
 * Password Reset Template
 *
 * Used for:
 * - Password reset requests
 * - Security-related email communications
 *
 * @param {string} resetLink - The password reset URL
 * @param {string} bandName - Band name for branding
 * @returns {Object} Template with subject and HTML
 */
const passwordReset = (resetLink, bandName = 'Bandsyte', theme = {}) => ({
  subject: `Reset Your Password - ${bandName} Admin`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - ${bandName} Admin</title>
      <style>
        body { font-family: "Courier New", monospace; line-height: 1.6; color: #333 !important; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000000; color: white !important; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; color: #333 !important; }
        .content p { color: #333 !important; }
        .content h2 { color: #333 !important; }
        .content strong { color: #333 !important; }
        .button { display: inline-block; background: #000000; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; border: none; transition: all 0.3s ease; }
        .button:hover { background: #333333; color: white !important; text-decoration: none; }
        .footer { text-align: center; margin-top: 30px; color: #333 !important; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404 !important; }
        .warning p { color: #856404 !important; }
        .warning strong { color: #856404 !important; }
        .security { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; color: #0c5460 !important; }
        .security strong { color: #0c5460 !important; }
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
          <p>Password Reset</p>
        </div>
        <div class="content">
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
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This password reset was sent by your Bandsyte website platform.</p>
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

module.exports = passwordReset;
