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
  bandName = 'Bandsyte'
) => ({
  subject:
    role === 'ADMIN' || role === 'SUPERADMIN'
      ? `Join the ${bandName} Crew - Admin Invitation`
      : `Verify Your Email - ${bandName} Admin`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${
        role === 'ADMIN' || role === 'SUPERADMIN'
          ? 'Admin Invitation'
          : 'Email Verification'
      }</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .bandsyte-brand { background: #f8f9fa; border: 1px solid #dee2e6; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${bandName}</h1>
          <p>${
            role === 'ADMIN' || role === 'SUPERADMIN'
              ? 'Admin Invitation'
              : 'Email Verification'
          }</p>
        </div>
        <div class="content">
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
        </div>
        <div class="bandsyte-brand">
          <p><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p>This verification was sent by your Bandsyte website platform.</p>
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

module.exports = emailVerification;
