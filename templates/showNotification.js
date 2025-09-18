const { bandToSubscriberTemplate } = require('./baseTemplates');

/**
 * Show Notification Email Template
 *
 * Used for:
 * - Notifying subscribers when new shows are added
 *
 * @param {string} bandName - The band's name
 * @param {Object} content - The show content that was added
 * @param {Object} theme - Theme object with bandLogoUrl
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */
const showNotification = (
  bandName,
  content,
  theme = {},
  unsubscribeToken = '',
  config
) => {
  // Build subject line
  const subject = `🎤 New Show Added: ${
    content.venue || 'Upcoming Show'
  } - ${bandName}`;

  // Build content details
  let contentDetails = `
    <div class="highlight">
      <h3>${content.venue || 'New Show'}</h3>
  `;

  if (content.location) {
    contentDetails += `<p><strong>Location:</strong> ${content.location}</p>`;
  }

  if (content.date) {
    contentDetails += `<p><strong>Date:</strong> ${new Date(
      content.date
    ).toLocaleDateString()}</p>`;
  }

  if (content.doors) {
    const doorTime = new Date(content.doors).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    contentDetails += `<p><strong>Doors:</strong> ${doorTime}</p>`;
  }

  if (content.showtime) {
    const showTime = new Date(content.showtime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    contentDetails += `<p><strong>Show:</strong> ${showTime}</p>`;
  }

  if (content.advprice || content.doorprice) {
    contentDetails += `<p><strong>Price:</strong>`;
    if (content.advprice) {
      contentDetails += ` $${content.advprice} advance`;
    }
    if (content.advprice && content.doorprice) {
      contentDetails += ` /`;
    }
    if (content.doorprice) {
      contentDetails += ` $${content.doorprice} door`;
    }
    contentDetails += `</p>`;
  }

  contentDetails += `</div>`;

  // Build CTA buttons
  let ctaButtons = `
    <a href="${config.clientURL}/home" class="cta-button">Show Details</a>
  `;

  if (content.tixlink) {
    ctaButtons += `
      <a href="${content.tixlink}" class="cta-button cta-button-secondary" target="_blank" rel="noopener noreferrer">Get Tickets</a>
    `;
  }

  const emailContent = `
    <h2>We just added a new show to our schedule!</h2>
    <p>Hey there! We wanted to let you know about an upcoming show we just added to our site.</p>
    
    ${contentDetails}
    
    <div class="cta-buttons">
      ${ctaButtons}
    </div>
    
    <p>Thanks for being part of our community!</p>
    <p>- The ${bandName} Team</p>
  `;

  return bandToSubscriberTemplate(
    bandName,
    subject,
    bandName,
    'New Show Added!',
    emailContent,
    theme,
    unsubscribeToken,
    config
  );
};

module.exports = showNotification;
