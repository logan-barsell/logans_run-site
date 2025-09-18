const { bandToSubscriberTemplate } = require('./baseTemplates');

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
const newsletterConfirmation = (
  bandName,
  email,
  unsubscribeToken = '',
  theme = {},
  config
) => {
  const subject = `You're In The Loop - ${bandName} Newsletter`;

  const content = `
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
  `;

  return bandToSubscriberTemplate(
    bandName,
    subject,
    bandName,
    'Newsletter Subscription Confirmed',
    content,
    theme,
    unsubscribeToken,
    config
  );
};

module.exports = newsletterConfirmation;
