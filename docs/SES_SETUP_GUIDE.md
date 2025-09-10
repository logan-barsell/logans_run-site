# AWS SES Bounce & Complaint Setup Guide

This guide will help you configure AWS SES to send bounce and complaint notifications to your Bandsyte application.

## 🎯 Multi-Domain Architecture Considerations

**Important:** Bandsyte supports both subdomains (band.bandsyte.com) and custom domains (yesdevil.com). Here are your options:

### Option 1: Single Domain Approach (Recommended for MVP)

- **Sending Domain:** Use `bandsyte.com` for all emails
- **FROM Address:** `noreply@bandsyte.com` or `hello@bandsyte.com`
- **Webhook:** Single endpoint handles all notifications
- **Pros:** Simple, cost-effective, easy to manage
- **Cons:** Less "white-label" appearance

### Option 2: Per-Band Domains (Full White-Label)

- **Sending Domain:** Each band uses their own domain
- **FROM Address:** `noreply@banddomain.com`
- **Webhook:** Multiple endpoints or routing logic
- **Pros:** Fully branded, professional appearance
- **Cons:** Complex setup, higher costs, DNS management per band

### Option 3: Hybrid Approach (Recommended Long-term)

- **Sending Domain:** `bandsyte.com` (verified in SES)
- **FROM Address:** Custom display name but bandsyte.com envelope
- **Webhook:** Single endpoint with routing logic
- **Pros:** White-label appearance, manageable complexity
- **Cons:** Some email clients show "via bandsyte.com"

## 🚀 Recommended Setup for MVP Launch

### Step 1: Single Domain Configuration (bandsyte.com)

```
✅ VERIFY: bandsyte.com in AWS SES
✅ FROM: noreply@bandsyte.com
✅ Webhook: https://yourapp.com/api/ses/notifications
✅ DKIM/SPF: Set up for bandsyte.com
```

### Step 2: Hybrid Email Approach

- **Envelope Sender:** noreply@bandsyte.com (verified domain)
- **Display Name:** "Yes Devil" <noreply@bandsyte.com> (white-label appearance)
- **Benefits:** Looks professional, single webhook, easy management

### Step 3: Future Expansion Ready

- Database already tracks band domains
- Email service supports custom FROM names
- Easy to add per-band SES configurations later

## Prerequisites

1. AWS SES account with production access
2. `bandsyte.com` domain verified in SES
3. HTTPS endpoint for webhook (required for SNS subscriptions)
4. DKIM/SPF/DMARC records for `bandsyte.com`

## Step 1: Create SNS Topic

1. Go to AWS SNS Console
2. Click "Create topic"
3. Choose "Standard" type
4. Name: `bandsyte-ses-notifications`
5. Create topic and note the ARN

## Step 2: Create SNS Subscription

**⚠️ NOTE:** SNS subscription requires your app to be deployed with a public HTTPS endpoint.

1. In SNS Console, select your topic
2. Click "Create subscription"
3. Protocol: `HTTPS`
4. Endpoint: `https://bandsyte.com/api/ses/notifications`
5. Create subscription

## Step 3: Configure SES Notification Settings

1. Go to AWS SES Console
2. Navigate to "Configuration Sets"
3. Click "Create configuration set"
4. Name: `bandsyte-config`
5. Enable "Use a configuration set in the Verified identities page"

### Configure Bounce Notifications

1. Under "Event destinations" → "Add destination"
2. Destination type: `Amazon SNS`
3. SNS topic: Select your `bandsyte-ses-notifications` topic
4. Events to publish: Check `Bounce`

### Configure Complaint Notifications

1. Add another destination
2. Destination type: `Amazon SNS`
3. SNS topic: Select your `bandsyte-ses-notifications` topic
4. Events to publish: Check `Complaint`

### Optional: Configure Delivery Notifications

1. Add another destination
2. Destination type: `Amazon SNS`
3. SNS topic: Select your `bandsyte-ses-notifications` topic
4. Events to publish: Check `Delivery`

## Step 4: Verify Domain Configuration

1. Go to "Verified identities" in SES Console
2. Select your domain
3. Under "Configuration set", select your `bandsyte-config` configuration set
4. Save changes

## Step 5: Test the Setup

### Test Bounce Notification

```bash
# Use SES mailbox simulator
aws ses send-email \
  --from your-verified-email@example.com \
  --to bounce@simulator.amazonses.com \
  --subject "Test Bounce" \
  --text "This should bounce"
```

### Test Complaint Notification

```bash
# Use SES mailbox simulator
aws ses send-email \
  --from your-verified-email@example.com \
  --to complaint@simulator.amazonses.com \
  --subject "Test Complaint" \
  --text "This should generate a complaint"
```

## Step 6: Monitor Webhook Logs

Check your application logs for:

```
📧 Processing bounce: Permanent for X recipients
📧 Processing complaint for X recipients
📧 Email delivered successfully to X recipients
```

## Troubleshooting

### SNS Subscription Confirmation

1. Check your webhook endpoint is accessible
2. Confirm HTTPS certificate is valid
3. Check application logs for subscription confirmation messages

### Webhook Not Receiving Messages

1. Verify SNS topic subscription is confirmed
2. Check SES configuration set is applied to domain
3. Confirm webhook endpoint URL is correct
4. Check application logs for errors

### Database Updates Not Working

1. Verify database connectivity (Prisma health)
2. Check `newsletterSubscriber` Prisma model fields
3. Confirm email addresses are properly formatted

## Security Considerations

1. **Verify SNS Signatures**: Implement proper SNS message signature verification
2. **Rate Limiting**: Consider rate limiting on webhook endpoints
3. **Logging**: Log all webhook activities for debugging
4. **Monitoring**: Set up alerts for high bounce/complaint rates

## Next Steps

1. Monitor bounce and complaint rates
2. Implement automated cleanup of bounced emails
3. Set up alerts for high complaint rates (>0.1%)
4. Consider implementing reputation monitoring

## Useful Links

- [AWS SES Bounce Handling](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/bounce-complaint-notifications.html)
- [AWS SNS Documentation](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- [SES Mailbox Simulator](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/mailbox-simulator.html)
