const { bandsyteToBandTemplate } = require('./baseTemplates');

/**
 * Email Verification Template
 *
 * Used for:
 * - Email verification for new user accounts
 * - Admin invitations
 *
 * @param {string} verificationLink - The verification URL
 * @param {string} role - User role (USER, ADMIN, SUPERADMIN)
 * @param {string} bandName - Band name for branding
 * @returns {Object} Template with subject and HTML
 */
const emailVerification = (
  verificationLink,
  role = 'USER',
  bandName = 'Bandsyte',
  theme = {},
  config
) => {
  const subject =
    role === 'ADMIN' || role === 'SUPERADMIN'
      ? `Join the ${bandName} Crew - Admin Invitation`
      : `Verify Your Email - ${bandName} Admin`;

  const headerSubtitle =
    role === 'ADMIN' || role === 'SUPERADMIN'
      ? 'Admin Invitation'
      : 'Email Verification';

  const content = `
    <h2>🤘 Welcome to ${bandName}!</h2>
    ${
      role === 'ADMIN' || role === 'SUPERADMIN'
        ? `<p>Hey there! You've been invited to join the <strong>${bandName}</strong> crew as a <strong>${role}</strong>.</p>
         <p>You'll have full access to manage the ${bandName} website and all the content.</p>`
        : `<p>Hey! Thanks for signing up. Let's get your <strong>${bandName}</strong> admin account verified and ready to rock!</p>`
    }
    <div style="text-align: center;">
      <a href="${verificationLink}" class="button">
        ${
          role === 'ADMIN' || role === 'SUPERADMIN'
            ? 'Join the Crew'
            : 'Verify Email'
        }
      </a>
    </div>
    <div class="warning">
      <strong>Quick note:</strong> This link expires in 3 days. If you didn't expect this email, just ignore it.
    </div>
    <p>If the button doesn't work, copy and paste this link:</p>
    <p style="word-break: break-all; color: #667eea;">${verificationLink}</p>
  `;

  return bandsyteToBandTemplate(
    bandName,
    subject,
    bandName,
    headerSubtitle,
    content,
    theme,
    config
  );
};

module.exports = emailVerification;
