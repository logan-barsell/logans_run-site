# AWS SES Setup Guide

This guide will help you set up AWS SES (Simple Email Service) for the Bandsyte email system.

## 🚀 **Why AWS SES?**

- ✅ **Cost-effective**: $0.10 per 1,000 emails
- ✅ **Free tier**: 62,000 emails/month when sent from EC2
- ✅ **High deliverability** and reliability
- ✅ **Easy integration** with Node.js
- ✅ **No monthly fees** - pay only for what you use

## 📋 **Prerequisites**

1. **AWS Account** - Create one at [aws.amazon.com](https://aws.amazon.com)
2. **Domain name** - For email verification
3. **Node.js application** - Your Bandsyte platform

## 🔧 **Step 1: Create AWS Account**

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the signup process
4. **Important**: You'll need a credit card, but you won't be charged for the free tier

## 🔑 **Step 2: Create IAM User**

### **Create IAM User for SES Access:**

1. **Go to IAM Console**:

   - Sign in to AWS Console
   - Search for "IAM" and click on it

2. **Create New User**:

   - Click "Users" → "Add user"
   - Username: `logans-run-ses-user`
   - Access type: "Programmatic access"

3. **Attach Permissions**:

   - Click "Attach existing policies directly"
   - Search for "AmazonSESFullAccess"
   - Select it and click "Next"

4. **Review and Create**:

   - Review the settings
   - Click "Create user"

5. **Save Credentials**:
   - **IMPORTANT**: Download the CSV file with credentials
   - You'll need the `Access Key ID` and `Secret Access Key`

## 📧 **Step 3: Set Up AWS SES**

### **Access SES Console:**

1. **Go to SES Console**:

   - Search for "SES" in AWS Console
   - Click on "Simple Email Service"

2. **Verify Your Email Address**:

   - Click "Verified identities"
   - Click "Create identity"
   - Choose "Email address"
   - Enter your admin email (e.g., `admin@yourdomain.com`)
   - Click "Create identity"
   - Check your email and click the verification link

3. **Verify Your Domain** (Recommended):
   - Click "Create identity" again
   - Choose "Domain"
   - Enter your domain (e.g., `yourdomain.com`)
   - Follow the DNS verification steps
   - Add the provided DNS records to your domain

## ⚙️ **Step 4: Configure Environment Variables**

### **Add to Your `.env` File:**

```bash
# ========================================
# EMAIL CONFIGURATION (AWS SES)
# ========================================

# AWS SES Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1

# From Email Address (must be verified in SES)
FROM_EMAIL=noreply@yourdomain.com

# Admin Email for Notifications
ADMIN_EMAIL=admin@yourdomain.com
```

### **Replace the values:**

- `your_access_key_id_here` → Your IAM user's Access Key ID
- `your_secret_access_key_here` → Your IAM user's Secret Access Key
- `noreply@yourdomain.com` → Your verified email or domain
- `admin@yourdomain.com` → Your admin email address

## 🧪 **Step 5: Test the Setup**

### **Start Your Application:**

```bash
npm run dev
```

### **Test Email Functionality:**

1. **Contact Form**: Submit a test message
2. **Newsletter Signup**: Subscribe to newsletter
3. **User Registration**: Create a new user account
4. **Password Reset**: Request a password reset

### **Check Logs:**

Look for these log messages:

- ✅ `📧 Email sent successfully to...`
- ✅ `📧 Contact form submitted by...`
- ✅ `📧 Newsletter signup:...`

## 🔒 **Step 6: Production Considerations**

### **Move Out of Sandbox Mode:**

By default, SES is in "sandbox mode" which limits you to verified email addresses only.

1. **Request Production Access**:

   - Go to SES Console → "Account dashboard"
   - Click "Request production access"
   - Fill out the form explaining your use case
   - Wait for approval (usually 24-48 hours)

2. **Use IAM Roles** (Recommended for production):
   - Instead of access keys, use IAM roles
   - More secure and easier to manage
   - Update the email service to use IAM roles

### **Domain Verification for Production:**

1. **Verify Your Domain**:

   - Add DNS records as provided by SES
   - Wait for verification (can take up to 72 hours)

2. **Set Up DKIM**:
   - Improves email deliverability
   - Follow SES console instructions

## 💰 **Cost Estimation**

### **Typical Bandsyte Client Usage:**

- **Contact forms**: ~10-50 emails/month per client
- **Newsletter signups**: ~20-100 emails/month per client
- **Password resets**: ~5-20 emails/month per client
- **Email verification**: ~10-30 emails/month per client

**Total**: ~45-200 emails/month per client
**Cost**: ~$0.005-$0.02/month per client (practically free!)

### **Free Tier Benefits:**

- **62,000 emails/month** when sent from EC2
- **1,000 emails/month** from any source
- **No charges** within free tier limits

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Email address not verified"**:

   - Verify your email address in SES console
   - Wait for verification email

2. **"Access denied"**:

   - Check your AWS credentials
   - Ensure IAM user has SES permissions

3. **"Region mismatch"**:

   - Make sure AWS_REGION matches your SES region
   - Default: `us-east-1`

4. **"Sandbox mode"**:
   - Request production access
   - Or only send to verified email addresses

### **Debug Commands:**

```bash
# Check environment variables
echo $AWS_ACCESS_KEY_ID
echo $AWS_REGION

# Test SES connection
node -e "
const { SESClient } = require('@aws-sdk/client-ses');
const client = new SESClient({ region: 'us-east-1' });
console.log('SES client created successfully');
"
```

## 📚 **Additional Resources**

- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [SES Pricing](https://aws.amazon.com/ses/pricing/)
- [SES Best Practices](https://docs.aws.amazon.com/ses/latest/dg/best-practices.html)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## ✅ **Success Checklist**

- [ ] AWS account created
- [ ] IAM user with SES permissions created
- [ ] Email addresses verified in SES
- [ ] Domain verified (optional but recommended)
- [ ] Environment variables configured
- [ ] Email functionality tested
- [ ] Production access requested (for production use)

Your AWS SES setup is now complete! 🎉
