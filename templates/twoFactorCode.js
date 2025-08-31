/**
 * Two-Factor Authentication Code Email Template
 *
 * Used for:
 * - Two-factor authentication verification codes
 * - Secure login verification
 *
 * @param {string} code - The 6-digit verification code
 * @param {string} bandName - Band name for branding
 * @returns {Object} Template with subject and HTML
 */
const twoFactorCode = (code, bandName = 'Bandsyte') => ({
  subject: `Your Login Code - ${bandName} Admin`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Login Code - ${bandName} Admin</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333 !important; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000000; color: white !important; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; color: #333 !important; }
        .content p { color: #333 !important; }
        .content h2 { color: #333 !important; }
        .content strong { color: #333 !important; }
        .footer { text-align: center; margin-top: 30px; color: #333 !important; font-size: 14px; }
        .code-container { background: #ffffff; border: 3px solid #000000; padding: 30px; border-radius: 10px; margin: 30px 0; text-align: center; }
        .code { font-size: 36px; font-weight: bold; color: #000000 !important; letter-spacing: 8px; font-family: 'Courier New', monospace; }
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
          <h1>${bandName}</h1>
          <p>🔐 Two-Factor Authentication</p>
        </div>
        <div class="content">
          <h2>Your Login Verification Code</h2>
          <p>Hey <strong>${bandName}</strong> admin,</p>
          <p>You're logging into your admin account. Use the verification code below to complete your login:</p>
          
          <div class="code-container">
            <div class="code">${code}</div>
          </div>
          
          <div class="warning">
            <p><strong>⚠️ Security Notice:</strong></p>
            <ul>
              <li>This code expires in <strong>5 minutes</strong></li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this code, please secure your account immediately</li>
            </ul>
          </div>
          
          <div class="security">
            <p><strong>ℹ️ Having trouble?</strong></p>
            <ul>
              <li>Make sure you're entering the code correctly</li>
              <li>Request a new code if this one has expired</li>
              <li>Contact support if you continue to have issues</li>
            </ul>
          </div>
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This verification code was sent by your Bandsyte website platform.</p>
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

module.exports = twoFactorCode;
