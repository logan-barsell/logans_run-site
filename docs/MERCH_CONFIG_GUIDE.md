# Merch Config System Guide

This guide explains how to use the new Merch Config system that supports Shopify, Stripe, and external storefronts.

## Overview

The Merch Config system allows you to configure your band's merchandise store to use different platforms:

- **Shopify**: Display products from a Shopify collection
- **Stripe**: Display Stripe payment links
- **External**: Redirect to an external store URL

## Setup Instructions

Configure Store Settings

1. Go to the admin panel
2. Navigate to "Store Config"
3. Choose your store type and configure accordingly

## Store Types

### Shopify Store

**Requirements:**

- Shopify store with Storefront API enabled
- Storefront access token
- Collection ID

**Configuration:**

- **Shop Domain**: Your Shopify store domain (e.g., `your-store.myshopify.com`)
- **Storefront Access Token**: API token from Shopify admin
- **Collection ID**: The collection ID containing your products

**How to get credentials:**

1. In Shopify admin, go to Settings > Apps and sales channels
2. Click "Develop apps" > "Create an app"
3. Configure Storefront API permissions
4. Generate a Storefront access token
5. Note your collection ID from the URL when viewing a collection

### Stripe Store

**Requirements:**

- Stripe account
- Payment links created in Stripe dashboard

**Configuration:**

- **Payment Link IDs**: List of Stripe payment link IDs (one per line)

**How to create payment links:**

1. In Stripe dashboard, go to Payment Links
2. Create payment links for each product
3. Copy the link IDs (the part after `buy.stripe.com/`)

### External Store

**Requirements:**

- External store URL (optional)

**Configuration:**

- **Store URL**: Full URL to your external store (optional - if left blank, the Store nav link will not appear)

## Navigation Behavior

- The "Store" nav item only appears when a valid merch config exists
- If no config exists, the nav item is hidden and `/store` redirects to 404
- For external stores with a valid URL, users are automatically redirected to the configured URL
- For external stores with an empty URL, the Store nav link will not appear

## API Endpoints

### GET /api/merchConfig

Fetch the current merch configuration

### POST /api/merchConfig

Create or update merch configuration

### DELETE /api/merchConfig

Delete the merch configuration

## Frontend Components

### ShopifyStorefront

- Fetches products from Shopify Storefront API
- Displays products in a grid layout
- Creates checkout sessions for purchases

### StripeStorefront

- Displays payment link buttons
- Redirects to Stripe checkout

### Store Page

- Loads merch config and renders appropriate storefront
- Handles external redirects
- Shows 404 if no valid config

## Migration from Old System

The old merch system (Stripe products + cart) is preserved at `/merch` and can still be used by:

1. Setting store type to "External"
2. Setting store URL to `/merch`

This allows for a gradual transition to the new system.

## Troubleshooting

### Shopify Issues

- Verify store domain format (should end with `.myshopify.com`)
- Check that Storefront API is enabled
- Ensure collection ID is correct
- Verify access token has proper permissions

### Stripe Issues

- Verify payment link IDs are correct
- Check that payment links are active
- Ensure links are from the correct Stripe account

### General Issues

- Check browser console for API errors
- Verify database connection
- Ensure all required fields are filled

## Security Notes

- Storefront access tokens are stored in the database
- Consider encrypting sensitive tokens in production
- Regularly rotate access tokens
- Monitor API usage and limits
