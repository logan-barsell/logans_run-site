const mongoose = require('mongoose');
const { Schema } = mongoose;

const MerchConfigSchema = new Schema(
  {
    storeType: {
      type: String,
      enum: ['shopify', 'stripe', 'external'],
      required: true,
    },
    shopDomain: {
      type: String,
      required: false,
    },
    storefrontAccessToken: {
      type: String,
      required: false,
    },
    collectionId: {
      type: String,
      required: false,
    },
    paymentLinkIds: [
      {
        type: String,
      },
    ],
    publishableKey: {
      type: String,
      required: false,
    },
    storefrontUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const MerchConfig = mongoose.model('MerchConfig', MerchConfigSchema);

module.exports = MerchConfig;
