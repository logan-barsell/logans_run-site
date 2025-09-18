const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Newsletter Signup Notification Template
 *
 * Used for:
 * - Notifying bands when fans sign up for their newsletter
 * - Keeping bands informed of new newsletter subscribers
 *
 * @param {string} fanEmail - The fan's email address
 * @param {string} bandName - The band's name
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const newsletterSignupNotification = (
  fanEmail,
  bandName = 'Bandsyte',
  theme = {},
  config
) => {
  const subject = `New Newsletter Signup - ${bandName}`;

  const content = `
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
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    'New Newsletter Signup',
    content,
    theme,
    config
  );
};

module.exports = newsletterSignupNotification;
