/**
 * Newsletter Confirmation Template
 *
 * Used for:
 * - Confirming newsletter signups from band website visitors
 * - Newsletter subscription confirmations
 *
 * @param {string} bandName - The band's name
 * @param {string} email - The subscriber's email
 * @returns {Object} Template with subject and HTML
 */
const newsletterConfirmation = (bandName, email) => ({
  subject: `You're In The Loop - ${bandName} Newsletter`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Newsletter Subscription Confirmed - ${bandName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #e8f5e8; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0; }
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
        </div>
      </div>
    </body>
    </html>
  `,
});

module.exports = newsletterConfirmation;
