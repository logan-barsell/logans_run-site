const config = require('../config');

/**
 * Show Notification Email Template
 *
 * Used for:
 * - Notifying subscribers when new shows are added
 *
 * @param {string} bandName - The band's name
 * @param {Object} content - The show content that was added
 * @param {Object} colors - Theme colors for email styling
 * @param {string} unsubscribeToken - Token for unsubscribing
 * @returns {Object} Template with subject and HTML
 */

const showNotification = (
  bandName,
  content,
  theme = {},
  unsubscribeToken = ''
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
            margin: 10px 10px 10px 0;
            text-align: center;
          }
          .cta-button:hover {
            background: #333333;
            color: white !important;
          }
          .cta-button-secondary {
            background: #666666;
            color: white !important;
          }
          .cta-button-secondary:hover {
            background: #888888;
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
            <p>New Show Added!</p>
          </div>
          <div class="content">
            <h2>We just added a new show to our schedule!</h2>
            <p>Hey there! We wanted to let you know about an upcoming show we just added to our site.</p>
            
            ${contentDetails}
            
            <div class="cta-buttons">
              ${ctaButtons}
            </div>
            
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

module.exports = showNotification;
