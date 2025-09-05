const config = require('../config');

/**
 * Video Notification Email Template
 *
 * Used for:
 * - Notifying subscribers when new videos are added
 *
 * @param {string} bandName - The band's name
 * @param {Object} content - The video content that was added
 * @param {Object} colors - Theme colors for email styling
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */

const videoNotification = (
  bandName,
  content,
  theme = {},
  unsubscribeToken = ''
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

  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
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
          body { font-family: "Courier New", monospace; line-height: 1.6; color: #333 !important; margin: 0; padding: 0; }
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
          .highlight h3 { color: #155724 !important; margin-top: 0; }
          .cta-button {
            display: inline-block;
            background: #000000;
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .cta-button:hover {
            background: #333333;
            color: white !important;
          }
          /* Override any global link styles */
          a.cta-button, .cta-button a {
            color: white !important;
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
            <p>New Video Uploaded!</p>
          </div>
          <div class="content">
            <h2>We just uploaded a new video!</h2>
            <p>Hey there! We wanted to let you know about a fresh video we just added to our site.</p>
            
            ${contentDetails}
            
            <a href="${
              config.clientURL
            }/media?tab=videos" class="cta-button">Watch Now</a>
            
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

module.exports = videoNotification;
