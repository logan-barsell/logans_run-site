/**
 * Contact Notification Template
 *
 * Used for:
 * - Notifying admins of new contact form submissions
 * - Customer inquiry notifications
 *
 * @param {Object} contactData - Contact form data
 * @param {string} bandName - Band name for branding
 * @param {Object} colors - Theme colors for email styling
 * @returns {Object} Template with subject and HTML
 */
const contactNotification = (
  contactData,
  bandName = 'Bandsyte',
  colors = {}
) => ({
  subject: `New Fan Message - ${bandName}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - ${bandName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${colors.header || '#3498db'}; color: ${
    colors.headerText || 'white'
  }; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: ${
          colors.content || '#f9f9f9'
        }; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #555; margin-bottom: 5px; }
        .field-value { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid ${
          colors.primary || '#3498db'
        }; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .bandsyte-brand { background: ${
          colors.footer || '#f8f9fa'
        }; border: 1px solid ${
    colors.border || '#dee2e6'
  }; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${bandName}</h1>
          <p>New Fan Message</p>
        </div>
        <div class="content">
          <h2>📧 Fan Mail Incoming!</h2>
          <p>Hey <strong>${bandName}</strong> crew,</p>
          <p>Someone just hit you up through your website. Time to rock and respond!</p>
          
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${
              contactData.name || 'Anonymous fan'
            }</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${
              contactData.email || 'No email provided'
            }</div>
          </div>
          
          ${
            contactData.title
              ? `
          <div class="field">
            <div class="field-label">Subject:</div>
            <div class="field-value">${contactData.title}</div>
          </div>
          `
              : ''
          }
          
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value">${
              contactData.message || 'No message provided'
            }</div>
          </div>
          
          <div class="field">
            <div class="field-label">Sent:</div>
            <div class="field-value">${new Date().toLocaleString()}</div>
          </div>
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This notification was sent by your Bandsyte website platform.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${bandName}. All rights reserved.</p>
          <p>Website powered by <strong>Bandsyte</strong>.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});

module.exports = contactNotification;
