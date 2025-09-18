const { bandToSubscriberTemplate } = require('./baseTemplates');
const { getCategoryDisplayName } = require('../utils/validation');

/**
 * Video Notification Email Template
 *
 * Used for:
 * - Notifying subscribers when new videos are added
 *
 * @param {string} bandName - The band's name
 * @param {Object} content - The video content that was added
 * @param {Object} theme - Theme object with bandLogoUrl
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */
const videoNotification = (
  bandName,
  content,
  theme = {},
  unsubscribeToken = '',
  config
) => {
  // Build subject line based on video category
  let subject = `🎬 New Video "${
    content.title || 'Video'
  }" Just Released! - ${bandName}`;

  if (content.category === 'musicVids') {
    subject = `🎬 New Music Video "${
      content.title || 'Video'
    }" Just Released! - ${bandName}`;
  } else if (content.category === 'liveVids') {
    subject = `🎬 New Live Performance "${
      content.title || 'Video'
    }" Just Released! - ${bandName}`;
  } else if (content.category === 'vlogs') {
    subject = `🎬 New Vlog "${
      content.title || 'Video'
    }" Just Released! - ${bandName}`;
  }

  // Build content details
  let contentDetails = `
    <div class="highlight">
      <h3>${content.title || 'New Video'}</h3>
  `;

  if (content.date) {
    contentDetails += `<p><strong>Release Date:</strong> ${new Date(
      content.date
    ).toLocaleDateString()}</p>`;
  }

  if (content.description) {
    contentDetails += `<p>${content.description}</p>`;
  }

  contentDetails += `</div>`;

  const emailContent = `
    <h2>We just uploaded a new ${getCategoryDisplayName(content.category)}!</h2>
    <p>Hey there! We wanted to let you know about a fresh ${getCategoryDisplayName(
      content.category
    ).toLowerCase()} we just added to our site.</p>
    
    ${contentDetails}
    
    <a href="${
      config.clientURL
    }/media?tab=videos" class="cta-button">Watch Now</a>
    
    <p>Thanks for being part of our community!</p>
    <p>- The ${bandName} Team</p>
  `;

  return bandToSubscriberTemplate(
    bandName,
    subject,
    bandName,
    `New ${getCategoryDisplayName(content.category)} Uploaded!`,
    emailContent,
    theme,
    unsubscribeToken,
    config
  );
};

module.exports = videoNotification;
