# Email Templates

This directory contains all email templates used throughout the Logans Run application. Each template is in its own file for better organization and maintainability.

## 📁 **Template Files**

### **1. `emailVerification.js`**

- **Purpose**: Verify user email addresses and admin invitations
- **Parameters**:
  - `verificationLink` - The verification URL
  - `role` - User role (USER, ADMIN, SUPERADMIN)
  - `bandName` - Brand name for customization
- **Usage**: Used for account verification and admin invitations
- **Theme**: Purple gradient

### **2. `passwordReset.js`**

- **Purpose**: Secure password reset functionality
- **Parameters**:
  - `resetLink` - The password reset URL
  - `bandName` - Brand name for customization
- **Usage**: When users request password reset
- **Theme**: Red gradient

### **3. `welcomeEmail.js`**

- **Purpose**: Welcome new users after email verification
- **Parameters**:
  - `bandName` - Brand name for customization
  - `dashboardUrl` - URL to the dashboard (optional)
- **Usage**: Sent after successful email verification
- **Theme**: Green gradient

### **4. `contactNotification.js`**

- **Purpose**: Notify admins of new contact form submissions
- **Parameters**:
  - `contactData` - Object containing form data (name, email, phone, message)
  - `bandName` - Brand name for customization
- **Usage**: When someone submits the contact form
- **Theme**: Blue gradient

### **5. `index.js`**

- **Purpose**: Central export point for all templates
- **Usage**: Import all templates with `require('../templates')`

## 🎨 **Customization**

### **Brand Colors**

Each template uses different color schemes that can be customized:

```css
/* Email Verification - Purple theme */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Password Reset - Red theme */
.header {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}
.button {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

/* Welcome Email - Green theme */
.header {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
}
.button {
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
}

/* Contact Notification - Blue theme */
.header {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}
```

### **Adding Your Logo**

To add your logo to templates:

1. Upload your logo to a CDN or your server
2. Add the logo URL to the template HTML:

```html
<div class="header">
  <img
    src="https://yourdomain.com/logo.png"
    alt="${bandName}"
    style="max-height: 60px; margin-bottom: 15px;"
  />
  <h1>${bandName}</h1>
  <p>Email Subject</p>
</div>
```

### **Custom Fonts**

To use custom fonts, add Google Fonts or web fonts:

```html
<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;700&display=swap"
    rel="stylesheet"
  />
  <style>
    body {
      font-family: 'Your Font', Arial, sans-serif;
    }
  </style>
</head>
```

## 🔧 **Usage Examples**

### **In Email Service**

```javascript
const {
  sendEmailVerification,
  sendPasswordReset,
} = require('../services/emailService');

// Send verification email
await sendEmailVerification(
  'user@example.com',
  'https://yourapp.com/verify?token=abc123',
  'USER',
  'Your Band Name'
);

// Send password reset
await sendPasswordReset(
  'user@example.com',
  'https://yourapp.com/reset?token=xyz789',
  'Your Band Name'
);
```

### **Creating New Templates**

1. Create a new template file (e.g., `newTemplate.js`):

```javascript
/**
 * New Template
 *
 * Used for:
 * - Description of use case
 *
 * @param {string} data - Template data
 * @param {string} bandName - Band name for branding
 * @returns {Object} Template with subject and HTML
 */
const newTemplate = (data, bandName = 'Logans Run') => ({
  subject: `Your Subject - ${bandName}`,
  html: `
    <!DOCTYPE html>
    <html>
      <!-- Your HTML template -->
    </html>
  `,
});

module.exports = newTemplate;
```

2. Add it to `index.js`:

```javascript
const newTemplate = require('./newTemplate');

module.exports = {
  // ... existing templates
  newTemplate,
};
```

3. Add a corresponding function to `emailService.js`:

```javascript
async function sendNewTemplate(to, data, bandName = 'Logans Run') {
  return sendEmail(to, null, null, 'newTemplate', {
    data,
    bandName,
  });
}
```

## 📱 **Responsive Design**

All templates are designed to be responsive and work well on:

- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones
- ✅ Email clients (Gmail, Outlook, Apple Mail)

### **Key Responsive Features**

- **Mobile-first design** - Optimized for small screens
- **Flexible containers** - Adapt to different screen sizes
- **Readable fonts** - Minimum 16px font size
- **Touch-friendly buttons** - Minimum 44px touch targets

## 🎯 **Best Practices**

### **Email Client Compatibility**

- Use **inline CSS** for maximum compatibility
- Avoid **JavaScript** (not supported in emails)
- Test in **multiple email clients**
- Use **web-safe fonts** as fallbacks

### **Accessibility**

- Use **semantic HTML** structure
- Include **alt text** for images
- Ensure **sufficient color contrast**
- Provide **text alternatives** for buttons

### **Performance**

- **Optimize images** for web
- Keep **file sizes small**
- Use **efficient CSS**
- **Minimize external dependencies**

## 🧪 **Testing**

### **Email Testing Tools**

- **Litmus** - Test across email clients
- **Email on Acid** - Comprehensive email testing
- **PutsMail** - Free email testing
- **Browser testing** - Test in different browsers

### **Development Testing**

```bash
# Test email functionality
npm run dev
# Then trigger email sending in your app
```

## 📚 **Resources**

- [Email Template Best Practices](https://www.emailonacid.com/blog/article/email-development/email-coding-best-practices/)
- [Responsive Email Design](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)
- [Email Client Support](https://www.caniemail.com/)
- [AWS SES Template Documentation](https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email.html)

## 🔄 **Version Control**

When updating templates:

1. **Test thoroughly** before committing
2. **Update documentation** if needed
3. **Consider backward compatibility**
4. **Review in multiple email clients**

## 📁 **File Structure**

```
templates/
├── index.js                 # Export all templates
├── emailVerification.js     # Email verification template
├── passwordReset.js         # Password reset template
├── welcomeEmail.js          # Welcome email template
├── contactNotification.js   # Contact form notification
└── README.md               # This documentation
```

Your email templates are now organized in individual files for better maintainability! 🚀
