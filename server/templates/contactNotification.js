const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Contact Notification Template
 *
 * Used for:
 * - Notifying admins of new contact form submissions
 * - Customer inquiry notifications
 *
 * @param {Object} contactData - Contact form data
 * @param {string} bandName - Band name for branding
 * @param {Object} theme - Theme object with bandLogoUrl
 * @returns {Object} Template with subject and HTML
 */
const contactNotification = (
  contactData,
  bandName = 'Bandsyte',
  theme = {},
  config
) => {
  const subject = `New Fan Message - ${bandName}`;

  const content = `
    <h2>📧 Fan Mail Incoming!</h2>
    <p>Hey <strong>${bandName}</strong> crew,</p>
    <p>Someone just hit you up through your website.</p>
    
    <div class="field">
      <div class="field-label">Name:</div>
      <div class="field-value">${contactData.name || 'Anonymous fan'}</div>
    </div>
    
    <div class="field">
      <div class="field-label">Email:</div>
      <div class="field-value">${contactData.email || 'No email provided'}</div>
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
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    'New Fan Message',
    content,
    theme,
    config
  );
};

module.exports = contactNotification;
