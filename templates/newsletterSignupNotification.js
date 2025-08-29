/**
 * Newsletter Signup Notification Template
 *
 * Used for:
 * - Notifying bands when fans sign up for their newsletter
 * - Keeping bands informed of new newsletter subscribers
 *
 * @param {string} fanEmail - The fan's email address
 * @param {string} bandName - The band's name
 * @param {Object} colors - Theme colors for email styling
 * @returns {Object} Template with subject and HTML
 */
const newsletterSignupNotification = (
  fanEmail,
  bandName = 'Bandsyte',
  colors = {}
) => ({
  subject: `New Newsletter Signup - ${bandName}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Newsletter Signup - ${bandName}</title>
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
        .highlight { background: #e8f5e8; border-left: 4px solid ${
          colors.primary || '#27ae60'
        }; padding: 15px; margin: 20px; }
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
          <p>New Newsletter Signup</p>
        </div>
        <div class="content">
          <h2>🎸 New Fan Just Joined!</h2>
          <p>Hey <strong>${bandName}</strong> crew,</p>
          <p>Someone just signed up for your newsletter! Your fan base is growing.</p>
          
          <div class="highlight">
            <p><strong>New Subscriber:</strong> ${fanEmail}</p>
            <p><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>This fan will now receive updates about:</p>
          <ul>
            <li>🎵 Your latest tracks and music videos</li>
            <li>🎤 Upcoming shows and tour dates</li>
            <li>🛍️ New merch drops and exclusive deals</li>
            <li>📸 Behind-the-scenes content</li>
            <li>🎁 VIP access and fan perks</li>
          </ul>
          
          <p>Keep rocking and keep your fans in the loop!</p>
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This notification was sent by your Bandsyte website platform.</p>
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

module.exports = newsletterSignupNotification;
