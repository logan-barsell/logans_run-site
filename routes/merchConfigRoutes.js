const express = require('express');
const router = express.Router();
const MerchConfig = require('../models/MerchConfig');

// GET /api/merchConfig - fetch the current merch config (public endpoint - only returns valid configs)
router.get('/api/merchConfig', async (req, res) => {
  try {
    const merchConfig = await MerchConfig.findOne();

    if (!merchConfig) {
      return res.json(null);
    }

    // Check if the configuration is valid for the selected store type
    let isValid = false;

    if (merchConfig.storeType === 'shopify') {
      isValid =
        merchConfig.shopDomain &&
        merchConfig.storefrontAccessToken &&
        merchConfig.collectionId;
    } else if (merchConfig.storeType === 'stripe') {
      // For Stripe, we need both publishable key and at least one valid buy button ID
      const hasValidPublishableKey =
        merchConfig.publishableKey &&
        typeof merchConfig.publishableKey === 'string' &&
        merchConfig.publishableKey.trim() !== '';

      const hasValidBuyButtonIds =
        merchConfig.paymentLinkIds &&
        Array.isArray(merchConfig.paymentLinkIds) &&
        merchConfig.paymentLinkIds.length > 0 &&
        merchConfig.paymentLinkIds.some(
          id => id && typeof id === 'string' && id.trim() !== ''
        );

      isValid = hasValidPublishableKey && hasValidBuyButtonIds;
    } else if (merchConfig.storeType === 'external') {
      isValid =
        merchConfig.storefrontUrl && merchConfig.storefrontUrl.trim() !== '';
    }

    // Only return the config if it's valid
    if (!isValid && merchConfig.storeType === 'stripe') {
      console.log('Stripe config validation failed:', {
        hasValidPublishableKey:
          merchConfig.publishableKey &&
          typeof merchConfig.publishableKey === 'string' &&
          merchConfig.publishableKey.trim() !== '',
        hasValidBuyButtonIds:
          merchConfig.paymentLinkIds &&
          Array.isArray(merchConfig.paymentLinkIds) &&
          merchConfig.paymentLinkIds.length > 0 &&
          merchConfig.paymentLinkIds.some(
            id => id && typeof id === 'string' && id.trim() !== ''
          ),
        publishableKey: merchConfig.publishableKey,
        paymentLinkIds: merchConfig.paymentLinkIds,
      });
    }
    res.json(isValid ? merchConfig : null);
  } catch (err) {
    console.error('MerchConfig API error:', err);
    res.status(500).json({ error: 'Failed to fetch merch config' });
  }
});

// GET /api/merchConfig/admin - fetch the current merch config for admin (returns all configs)
router.get('/api/merchConfig/admin', async (req, res) => {
  try {
    const merchConfig = await MerchConfig.findOne();
    res.json(merchConfig || null);
  } catch (err) {
    console.error('MerchConfig admin API error:', err);
    res.status(500).json({ error: 'Failed to fetch merch config' });
  }
});

// POST /api/merchConfig - create or update the merch config
router.post('/api/merchConfig', async (req, res) => {
  try {
    const configData = req.body;

    // Allow store type changes without validation
    // Users can switch between types freely and save incomplete configurations

    let merchConfig = await MerchConfig.findOne();

    if (merchConfig) {
      // Update existing config
      Object.assign(merchConfig, configData);
      await merchConfig.save();
    } else {
      // Create new config
      merchConfig = await MerchConfig.create(configData);
    }

    res.json(merchConfig);
  } catch (err) {
    console.error('MerchConfig update error:', err);
    res.status(500).json({ error: 'Failed to update merch config' });
  }
});

// DELETE /api/merchConfig - delete the merch config
router.delete('/api/merchConfig', async (req, res) => {
  try {
    await MerchConfig.deleteMany({});
    res.json({ message: 'Merch config deleted successfully' });
  } catch (err) {
    console.error('MerchConfig delete error:', err);
    res.status(500).json({ error: 'Failed to delete merch config' });
  }
});

module.exports = router;
