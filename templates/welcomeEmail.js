/**
 * Welcome Email Template
 *
 * Used for:
 * - Welcoming new bands to Bandsyte
 * - Onboarding communications
 *
 * @param {string} bandName - Band name for branding
 * @param {string} dashboardUrl - URL to the dashboard (optional)
 * @returns {Object} Template with subject and HTML
 */
const welcomeEmail = (bandName = 'Bandsyte', dashboardUrl = '') => ({
  subject: `Welcome to Bandsyte - ${bandName} Website is Live!`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Bandsyte</title>
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
        .bandsyte-brand { background: #000000; color: white !important; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Bandsyte!</h1>
          <p>Your website is live and ready to rock!</p>
        </div>
        <div class="content">
          <h2>🤘 Your Website is Live!</h2>
          <p>Hey <strong>${bandName}</strong> crew,</p>
          <p>Welcome to <strong>Bandsyte</strong>! Your professional band website is up and running, ready to connect with your fans.</p>
          <p>Your <strong>${bandName}</strong> website is now live and you can:</p>
          <ul>
            <li>🎸 Upload your latest tracks and videos</li>
            <li>🎤 Add tour dates and show info</li>
            <li>🛍️ Set up your merch store</li>
            <li>📸 Share behind-the-scenes content</li>
            <li>🎵 Connect with your fans worldwide</li>
          </ul>
          ${
            dashboardUrl
              ? `
          <div style="text-align: center;">
            <a href="${dashboardUrl}" class="button">Get Started</a>
          </div>
          `
              : ''
          }
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>Thanks for choosing Bandsyte to help you rock the web!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Bandsyte. All rights reserved.</p>
          <p>If you have any questions, hit us up - we're here to help!</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

module.exports = welcomeEmail;
