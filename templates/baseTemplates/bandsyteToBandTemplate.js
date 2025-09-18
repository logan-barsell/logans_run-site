// // Config will be passed as parameter to avoid circular dependencies

// const { getColorPalette } = require('../../utils/colorPalettes');

// /**
//  * Base Template for Bandsyte-to-Band Emails
//  *
//  * Used for:
//  * - Email verification
//  * - Password reset
//  * - Welcome emails
//  * - Contact notifications
//  * - Security alerts
//  * - Two-factor authentication
//  * - Login alerts
//  *
//  * @param {string} bandName - The band's name
//  * @param {string} subject - Email subject
//  * @param {string} headerTitle - Title shown in header
//  * @param {string} headerSubtitle - Subtitle shown in header
//  * @param {string} content - Main email content HTML
//  * @param {Object} theme - Theme object with bandLogoUrl
//  * @param {string} clientUrl - Client URL for logo reference
//  * @returns {Object} Template with subject and HTML
//  */
// const bandsyteToBandTemplate = (
//   bandName,
//   subject,
//   headerTitle,
//   headerSubtitle,
//   content,
//   theme = {}
// ) => {
//   const bg = getColorPalette(theme.backgroundColor);
//   return {
//     subject,
//     html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>${subject}</title>
//       ${
//         theme.bandLogoUrl
//           ? `
//       <meta property="og:image" content="${theme.bandLogoUrl}" />
//       <meta name="twitter:image" content="${theme.bandLogoUrl}" />
//       <meta name="twitter:card" content="summary_large_image" />
//       <link rel="icon" type="image/png" href="${theme.bandLogoUrl}" />
//       `
//           : ''
//       }
//       <style>
//         /* Force light mode - prevents dark mode color inversion */
//         :root {
//           color-scheme: light !important;
//           -webkit-color-scheme: light !important;
//         }

//         body {
//           line-height: 1.6;
//           color: #333 !important;
//           margin: 0;
//           padding: 0;
//           color-scheme: light !important;
//           -webkit-color-scheme: light !important;
//         }
//         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//         .header { background: ${
//           bg.navbar
//         }; color: white !important; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
//         .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; color: #333 !important; }
//         .content p { color: #333 !important; }
//         .content h2 { color: #333 !important; }
//         .content strong { color: #333 !important; }
//         .button { display: inline-block; background: #000000; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; border: none; transition: all 0.3s ease; }
//         .button:hover { background: #333333; color: white !important; text-decoration: none; }
//         .footer { text-align: center; margin-top: 30px; color: #333 !important; font-size: 14px; }
//         .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #856404 !important; }
//         .warning p { color: #856404 !important; }
//         .warning strong { color: #856404 !important; }
//         .bandsyte-brand { background: ${
//           bg.navbar
//         }; color: white !important; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
//         .bandsyte-brand img {
//   max-height: 40px;
//   max-width: 100%;
//   height: auto;
//   width: auto;
//   object-fit: contain;
//   display: block;
//   margin: 0 auto 10px auto;
//   border-radius: 8px;

// }
//         .field { margin-bottom: 20px; }
//         .field-label { font-weight: bold; color: #555 !important; margin-bottom: 5px; }
//         .field-value { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; color: #333 !important; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           ${
//             theme.bandLogoUrl
//               ? `<img src="${theme.bandLogoUrl}" alt="${bandName} Logo" style="max-height: 130px; height: auto; width: auto;" />`
//               : ''
//           }
//           <h1>${headerTitle}</h1>
//           ${headerSubtitle ? `<p>${headerSubtitle}</p>` : ''}
//         </div>
//         <div class="content">
//           ${content}
//         </div>
//         <div class="bandsyte-brand">
//           <img src="https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/BANDSYTE_BRAND_LOGO.png?alt=media&token=f830d247-dca7-46ae-a727-e3b69da58e42" alt="Bandsyte" style="max-height: 40px; margin-bottom: 10px;" />
//           <p><strong>Bandsyte</strong> - Professional Band Websites</p>
//           <p>This notification was sent by your Bandsyte website platform.</p>
//         </div>
//         <div class="footer">
//           <p>&copy; ${new Date().getFullYear()} ${bandName}. All rights reserved.</p>
//           <p>Website powered by <strong>Bandsyte</strong>.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
//   };
// };

// module.exports = bandsyteToBandTemplate;

const { getColorPalette } = require('../../utils/colorPalettes');

const bandsyteToBandTemplate = (
  bandName,
  subject,
  headerTitle,
  headerSubtitle,
  content,
  theme = {}
) => {
  const bg = getColorPalette(theme.backgroundColor);
  const campaignId = `campaign-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  return {
    subject,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <!-- ${campaignId} -->
      <span style="display:none; font-size:0; line-height:0;">${campaignId}-top</span>
      <style>
        :root { color-scheme: light !important; -webkit-color-scheme: light !important; }
        body { margin:0; padding:0; line-height:1.6; color:#333 !important; }
        .container { max-width:600px; margin:0 auto; padding:20px; }
      </style>
    </head>
    <body style="margin:0; padding:0; line-height:1.6; color:#333 !important; background:#ffffff;">
      <div class="container" style="max-width:600px; margin:0 auto; padding:20px;">
        <div class="header" style="background:${
          bg.navbar
        }; color:white !important; padding:30px; text-align:center; border-radius:10px 10px 0 0;">
          ${
            theme.bandLogoUrl
              ? `<img src="${theme.bandLogoUrl}" alt="${bandName} Logo" style="max-height:130px; height:auto; width:auto;" />`
              : ''
          }
          <h1 style="margin:20px 0 10px; font-size:24px; color:white !important;">${headerTitle}</h1>
          ${
            headerSubtitle
              ? `<p style="margin:0; color:white !important;">${headerSubtitle}</p>`
              : ''
          }
        </div>
        <div class="content" style="background:#f9f9f9; padding:30px; border-radius:0 0 10px 10px; color:#333 !important;">
          ${content}
        </div>
         <!-- ${campaignId} -->
      <span style="display:none; font-size:0; line-height:0;">${campaignId}-middle</span>
        <div class="bandsyte-brand" style="background:${
          bg.navbar
        }; color:white !important; padding:20px; border-radius:8px; margin:20px 0; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <img src="https://firebasestorage.googleapis.com/v0/b/yes-devil.appspot.com/o/BANDSYTE_BRAND_LOGO.png?alt=media&token=f830d247-dca7-46ae-a727-e3b69da58e42" alt="Bandsyte" style="max-height:40px; margin-bottom:10px; display:block; margin-left:auto; margin-right:auto; border-radius:8px;" />
          <p style="margin:0 0 5px;"><strong>Bandsyte</strong> - Professional Band Websites</p>
          <p style="margin:0;">This notification was sent by your Bandsyte website platform.</p>
        </div>
        <div class="footer" style="text-align:center; margin-top:30px; color:#333 !important; font-size:14px;">
          <p style="margin:0;">&copy; ${new Date().getFullYear()} ${bandName}. All rights reserved.</p>
          <p style="margin:0;">Website powered by <strong>Bandsyte</strong>.</p>
        </div>
      </div>
       <!-- ${campaignId} -->
      <span style="display:none; font-size:0; line-height:0;">${campaignId}-top</span>
    </body>
    </html>
  `,
  };
};

module.exports = bandsyteToBandTemplate;
