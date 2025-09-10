const config = require('../config');

/**
 * Newsletter Notification Templates
 *
 * Used for:
 * - Notifying subscribers when new shows are added
 * - Notifying subscribers when new music is added
 * - Notifying subscribers when new videos are added
 *
 * @param {string} bandName - The band's name
 * @param {Object} content - The content that was added
 * @param {string} contentType - Type of content ('show', 'music', 'video')
 * @param {Object} colors - Theme colors for email styling
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */

const getContentIcon = contentType => {
  switch (contentType) {
    case 'show':
      return '🎤';
    case 'music':
      return '🎵';
    case 'video':
      return '🎬';
    default:
      return '📢';
  }
};

const getContentTitle = contentType => {
  switch (contentType) {
    case 'show':
      return 'New Show Added!';
    case 'music':
      return 'New Music Released!';
    case 'video':
      return 'New Video Uploaded!';
    default:
      return 'New Content Added!';
  }
};

const getContentDescription = contentType => {
  switch (contentType) {
    case 'show':
      return 'We just added a new show to our schedule!';
    case 'music':
      return 'We just released new music!';
    case 'video':
      return 'We just uploaded a new video!';
    default:
      return 'We just added new content to our site!';
  }
};

const newsletterNotification = (
  bandName,
  content,
  contentType,
  unsubscribeToken = '',
  theme = {}
) => {
  const icon = getContentIcon(contentType);
  const title = getContentTitle(contentType);
  const description = getContentDescription(contentType);

  // Build content details based on type
  let contentDetails = '';
  let ctaText = '';
  let ctaLink = '';

  switch (contentType) {
    case 'show':
      contentDetails = `
        <div class="content-details">
          <h3>${content.title || 'New Show'}</h3>
          ${
            content.date
              ? `<p><strong>Date:</strong> ${new Date(
                  content.date
                ).toLocaleDateString()}</p>`
              : ''
          }
          ${
            content.venue
              ? `<p><strong>Venue:</strong> ${content.venue}</p>`
              : ''
          }
          ${
            content.location
              ? `<p><strong>Location:</strong> ${content.location}</p>`
              : ''
          }
          ${content.description ? `<p>${content.description}</p>` : ''}
        </div>
      `;
      ctaText = 'View Show Details';
      ctaLink = `${config.clientURL}/shows`;
      break;

    case 'music':
      contentDetails = `
        <div class="content-details">
          <h3>${content.title || 'New Music'}</h3>
          ${
            content.artist
              ? `<p><strong>Artist:</strong> ${content.artist}</p>`
              : ''
          }
          ${
            content.album
              ? `<p><strong>Album:</strong> ${content.album}</p>`
              : ''
          }
          ${content.description ? `<p>${content.description}</p>` : ''}
        </div>
      `;
      ctaText = 'Listen Now';
      ctaLink = `${config.clientURL}/music`;
      break;

    case 'video':
      contentDetails = `
        <div class="content-details">
          <h3>${content.title}</h3>
          <p>${content.description}</p>
        </div>
      `;
      ctaText = 'Watch Video';
      ctaLink = `${config.clientURL}/videos`;
      break;
  }

  return {
    subject: `${icon} ${title} - ${bandName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${bandName}</title>
        ${
          theme.bandLogoUrl
            ? `
        <meta property="og:image" content="${theme.bandLogoUrl}" />
        <meta name="twitter:image" content="${theme.bandLogoUrl}" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="${theme.bandLogoUrl}" />
        `
            : ''
        }
        <style>
          body { 
            font-family: "Courier New", monospace; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: #000000; 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header .icon {
            font-size: 48px;
            margin-bottom: 10px;
            display: block;
          }
          .content { 
            background: white; 
            padding: 40px 30px; 
          }
          .content h2 {
            color: #27ae60;
            margin-top: 0;
            font-size: 24px;
          }
          .content-details {
            background: #f8f9fa;
            border-left: 4px solid #27ae60;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
            color: #333;
          }
          .content-details h3 {
            margin-top: 0;
            color: #27ae60;
          }
          .cta-button {
            display: inline-block;
            background: #27ae60;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .cta-button:hover {
            background: #219a52;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
            border-top: 1px solid #dee2e6;
          }
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
            ${
              theme.bandLogoUrl
                ? `<img src="${theme.bandLogoUrl}" alt="${bandName} Logo" style="max-height: 130px; height: auto; width: auto;" />`
                : ''
            }
            <h1>${bandName}</h1>
            <p>${title}</p>
          </div>
          <div class="content">
            <h2>${description}</h2>
            <p>Hey there! We wanted to let you know about some fresh content we just added to our site.</p>
            
            ${contentDetails}
            
            <a href="${ctaLink}" class="cta-button">${ctaText}</a>
            
            <p>Thanks for being part of our community!</p>
            <p>- The ${bandName} Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to you because you're subscribed to ${bandName}'s newsletter.</p>
            <div class="unsubscribe">
              <p>
                <a href="${
                  config.clientURL
                }/unsubscribe?token=${unsubscribeToken}">
                  Unsubscribe from these notifications
                </a>
              </p>
              <p>Powered by <strong>Bandsyte</strong> - Professional Band Websites</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};

module.exports = newsletterNotification;
