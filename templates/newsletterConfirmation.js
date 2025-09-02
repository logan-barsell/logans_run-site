/**
 * Newsletter Confirmation Template
 *
 * Used for:
 * - Confirming newsletter signups from band website visitors
 * - Newsletter subscription confirmations
 *
 * @param {string} bandName - The band's name
 * @param {string} email - The subscriber's email
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */
const newsletterConfirmation = (bandName, email, unsubscribeToken = '') => ({
  subject: `You're In The Loop - ${bandName} Newsletter`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Newsletter Subscription Confirmed - ${bandName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333 !important; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #000000; color: white !important; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; color: #333 !important; }
        .content p { color: #333 !important; }
        .content h2 { color: #333 !important; }
        .content strong { color: #333 !important; }
        .footer { text-align: center; margin-top: 30px; color: #333 !important; font-size: 14px; }
        .highlight { background: #e8f5e8; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0; color: #155724 !important; }
        .highlight p { color: #155724 !important; }
        .highlight strong { color: #155724 !important; }
        .unsubscribe {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          font-size: 12px;
          color: #999;
        }
        .unsubscribe a {
          color: #999;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${bandName}</h1>
          <p>Newsletter Subscription Confirmed</p>
        </div>
        <div class="content">
          <h2>🤘 You're In The Loop!</h2>
          <p>Hell yeah! You're now subscribed to <strong>${bandName}</strong>'s newsletter.</p>
          
          <div class="highlight">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Status:</strong> ✅ Locked and loaded</p>
          </div>
          
          <p>Get ready for the latest on:</p>
          <ul>
            <li>🎸 New tracks and music videos</li>
            <li>🎤 Tour dates and live shows</li>
            <li>🛍️ Fresh merch drops and exclusive deals</li>
            <li>📸 Backstage content and studio updates</li>
            <li>🎁 VIP access and fan perks</li>
          </ul>
          
          <p>We're stoked to keep you in the know with everything <strong>${bandName}</strong>!</p>
          
          <p><em>If you didn't sign up for this newsletter, no worries - just ignore this email.</em></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${bandName}. All rights reserved.</p>
          <p>This newsletter is powered by <strong>Bandsyte</strong> - Professional band websites.</p>
          ${
            unsubscribeToken
              ? `
          <div class="unsubscribe">
            <p>
              <a href="${
                process.env.SITE_URL || 'https://yourbandsite.com'
              }/unsubscribe?token=${unsubscribeToken}">
                Unsubscribe from these notifications
              </a>
            </p>
          </div>
          `
              : ''
          }
        </div>
      </div>
    </body>
    </html>
  `,
});

module.exports = newsletterConfirmation;
