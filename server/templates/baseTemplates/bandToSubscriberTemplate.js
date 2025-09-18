// // Config will be passed as parameter to avoid circular dependencies

// const { getColorPalette } = require('../../utils/colorPalettes');

// /**
//  * Base Template for Band-to-Subscriber Emails
//  *
//  * Used for:
//  * - Newsletter confirmations
//  * - Music notifications
//  * - Video notifications
//  * - Show notifications
//  * - Newsletter signup notifications
//  *
//  * @param {string} bandName - The band's name
//  * @param {string} subject - Email subject
//  * @param {string} headerTitle - Title shown in header
//  * @param {string} headerSubtitle - Subtitle shown in header
//  * @param {string} content - Main email content HTML
//  * @param {Object} theme - Theme object with bandLogoUrl
//  * @param {string} unsubscribeToken - Token for unsubscribing (optional)
//  * @returns {Object} Template with subject and HTML
//  */
// const bandToSubscriberTemplate = (
//   bandName,
//   subject,
//   headerTitle,
//   headerSubtitle,
//   content,
//   theme = {},
//   unsubscribeToken = '',
//   config
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
//         .footer { text-align: center; margin-top: 30px; color: #333 !important; font-size: 14px; }
//         .highlight { background: #e8f5e8; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0; color: #155724 !important; }
//         .highlight p { color: #155724 !important; }
//         .highlight strong { color: #155724 !important; }
//         .highlight h3 { color: #155724 !important; margin-top: 0; }
//         .cta-button {
//           display: inline-block;
//           background: #000000;
//           color: white !important;
//           padding: 15px 30px;
//           text-decoration: none;
//           border-radius: 5px;
//           font-weight: bold;
//           margin: 20px 0;
//           text-align: center;
//         }
//         .cta-button:hover {
//           background: #333333;
//           color: white !important;
//         }
//         .unsubscribe {
//           margin-top: 20px;
//           padding-top: 20px;
//           border-top: 1px solid #dee2e6;
//           font-size: 12px;
//           color: #999;
//         }
//         .unsubscribe a {
//           color: #999;
//           text-decoration: underline;
//         }
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
//         <div class="footer">
//           <p>This email was sent to you because you're subscribed to ${bandName}'s newsletter.</p>
//           ${
//             unsubscribeToken
//               ? `
//           <div class="unsubscribe">
//             <p>
//               <a href="${config.clientURL}/unsubscribe?token=${unsubscribeToken}">
//                 Unsubscribe from these notifications
//               </a>
//             </p>
//             <p>Powered by <strong>Bandsyte</strong> - Professional Band Websites</p>
//           </div>
//           `
//               : `
//           <div class="unsubscribe">
//             <p>Powered by <strong>Bandsyte</strong> - Professional Band Websites</p>
//           </div>
//           `
//           }
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
//   };
// };

// module.exports = bandToSubscriberTemplate;

const { getColorPalette } = require('../../utils/colorPalettes');

const bandToSubscriberTemplate = (
  bandName,
  subject,
  headerTitle,
  headerSubtitle,
  content,
  theme = {},
  unsubscribeToken = '',
  config
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
        <div class="footer" style="text-align:center; margin-top:30px; color:#333 !important; font-size:14px;">
          <p style="margin:0 0 10px;">This email was sent to you because you're subscribed to ${bandName}'s newsletter.</p>
          ${
            unsubscribeToken
              ? `
          <div class="unsubscribe" style="margin-top:20px; padding-top:20px; border-top:1px solid #dee2e6; font-size:12px; color:#999;">
            <p style="margin:0;">
              <a href="${config.clientURL}/unsubscribe?token=${unsubscribeToken}" style="color:#999; text-decoration:underline;">
                Unsubscribe from these notifications
              </a>
            </p>
            <p style="margin:10px 0 0;">Powered by <strong>Bandsyte</strong> - Professional Band Websites</p>
          </div>
          `
              : `
          <div class="unsubscribe" style="margin-top:20px; padding-top:20px; border-top:1px solid #dee2e6; font-size:12px; color:#999;">
            <p style="margin:0;">Powered by <strong>Bandsyte</strong> - Professional Band Websites</p>
          </div>
          `
          }
        </div>
      </div>
       <!-- ${campaignId} -->
      <span style="display:none; font-size:0; line-height:0;">${campaignId}-bottom</span>
    </body>
    </html>
  `,
  };
};

module.exports = bandToSubscriberTemplate;
