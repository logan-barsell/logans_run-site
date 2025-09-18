const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Welcome Email Template
 *
 * Used for:
 * - Welcoming new bands to Bandsyte
 * - Onboarding communications
 *
 * @param {string} bandName - Band name for branding
 * @param {string} dashboardUrl - URL to the dashboard (optional)
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const welcomeEmail = (
  bandName = 'Bandsyte',
  dashboardUrl = '',
  theme = {},
  config
) => {
  const subject = `Welcome to Bandsyte - ${bandName} Website is Live!`;

  const content = `
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
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    'Welcome to Bandsyte!',
    'Your website is live and ready to rock!',
    content,
    theme,
    config
  );
};

module.exports = welcomeEmail;
