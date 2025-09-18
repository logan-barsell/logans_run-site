const { bandToSubscriberTemplate } = require('./baseTemplates');

/**
 * Music Notification Email Template
 *
 * Used for:
 * - Notifying subscribers when new music is added
 *
 * @param {string} bandName - The band's name
 * @param {Object} content - The music content that was added
 * @param {Object} theme - Theme object with bandLogoUrl
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */
const musicNotification = (
  bandName,
  content,
  theme = {},
  unsubscribeToken = '',
  config
) => {
  const musicType = content.type || 'music';

  // Helper function to get proper article (a/an) for music type
  const getArticle = type => {
    const lowerType = type.toLowerCase();
    return ['album', 'ep'].includes(lowerType) ? 'an' : 'a';
  };

  // Helper function to get proper display name for music type
  const getDisplayName = type => {
    const upperType = type.toUpperCase();
    if (upperType === 'EP' || upperType === 'LP') {
      return upperType;
    }
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  // Helper function to get lowercase display name (keeping EP/LP capitalized)
  const getLowercaseDisplayName = type => {
    const upperType = type.toUpperCase();
    if (upperType === 'EP' || upperType === 'LP') {
      return upperType; // Keep EP and LP capitalized even in lowercase context
    }
    return type.toLowerCase();
  };

  // Build subject line
  const subject = `🎵 New ${getDisplayName(musicType)} ${
    content.title ? `"${content.title}" ` : ''
  }Just Released! - ${bandName}`;

  // Build content details
  let contentDetails = `
    <div class="highlight">
      <h3>${
        content.title || `New ${getDisplayName(musicType)}`
      } by ${bandName}</h3>
  `;

  if (content.releaseDate) {
    contentDetails += `<p><strong>Release Date:</strong> ${new Date(
      content.releaseDate
    ).toLocaleDateString()}</p>`;
  }

  contentDetails += `</div>`;

  const emailContent = `
    <h2>We just released ${getArticle(musicType)} new ${getLowercaseDisplayName(
    musicType
  )}!</h2>
    <p>Hey there! We wanted you to be the first to know about our newest release. Give it a listen and let us know what you think!</p>
    
    ${contentDetails}
    
    <a href="${config.clientURL}/music" class="cta-button">Listen Now</a>
    
    <p>Thanks for being part of our community!</p>
    <p>- The ${bandName} Team</p>
  `;

  return bandToSubscriberTemplate(
    bandName,
    subject,
    bandName,
    `New ${getDisplayName(musicType)} Released!`,
    emailContent,
    theme,
    unsubscribeToken,
    config
  );
};

module.exports = musicNotification;
