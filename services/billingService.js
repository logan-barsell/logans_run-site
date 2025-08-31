const logger = require('../utils/logger');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(
  __dirname,
  '../config/serviceAccountKey.json'
));

// Initialize Firebase if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yes-devil.appspot.com',
  });
}
const bucket = admin.storage().bucket();

// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET) {
    logger.warn(
      '⚠️  STRIPE_SECRET environment variable is not set. Stripe functionality will be disabled.'
    );
    stripe = null;
  } else {
    stripe = require('stripe')(process.env.STRIPE_SECRET);
  }
} catch (error) {
  logger.error('❌ Failed to initialize Stripe:', error.message);
  stripe = null;
}

/**
 * Check if Stripe is available
 */
function checkStripeAvailable() {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }
  return true;
}

/**
 * Get all products from Stripe
 */
async function getProducts() {
  try {
    checkStripeAvailable();

    const products = await stripe.products.list({
      active: true,
      limit: 100,
    });

    // Sort products by creation date (oldest first)
    products.data.sort((a, b) => a.created - b.created);
    const productList = [];

    await Promise.all(
      products.data.map(async product => {
        // Skip products without a default_price
        if (!product.default_price || product.default_price === '') {
          logger.warn(
            `Product ${product.id} (${product.name}) has no default_price, skipping`
          );
          return;
        }

        try {
          const price = await stripe.prices.retrieve(product.default_price);
          productList.push({ product, price, quantity: 1, size: 'MD' });
        } catch (priceError) {
          logger.error(
            `Failed to retrieve price for product ${product.id}:`,
            priceError.message
          );
          // Skip this product if price retrieval fails
        }
      })
    );

    return productList;
  } catch (error) {
    logger.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Create a checkout session
 */
async function createCheckoutSession(products) {
  try {
    checkStripeAvailable();

    const productlist = [];
    await Promise.all(
      products.map(async product => {
        const price = await stripe.prices.retrieve(product.price);
        const findProduct = await stripe.products.retrieve(price.product);
        productlist.push({
          quantity: product.quantity,
          price_data: {
            unit_amount: price.unit_amount,
            currency: 'usd',
            product_data: {
              name: `${findProduct.name} | ${product.size} `,
              description: findProduct.description,
              images: findProduct.images,
              metadata: {
                size: product.size,
              },
            },
          },
        });
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: productlist,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate: process.env.SHIPPING_RATE_ID,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.STRIPE_REDIRECT_DOMAIN}/merch?success=true`,
      cancel_url: `${process.env.STRIPE_REDIRECT_DOMAIN}/merch?canceled=true`,
    });

    logger.info('Checkout session created successfully');
    return session;
  } catch (error) {
    logger.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Get shipping rate
 */
async function getShippingRate() {
  try {
    checkStripeAvailable();

    const shippingRate = await stripe.shippingRates.retrieve(
      process.env.SHIPPING_RATE_ID
    );
    return shippingRate;
  } catch (error) {
    logger.error('Error fetching shipping rate:', error);
    throw error;
  }
}

/**
 * Create a new product
 */
async function createProduct(productData) {
  try {
    checkStripeAvailable();

    const { name, description, sizes, price, images = [] } = productData;

    if (!name || !price) {
      throw new Error('Product name and price are required');
    }

    const product = await stripe.products.create({
      name,
      description,
      images,
      metadata: { sizes },
      default_price_data: {
        unit_amount: price,
        currency: 'usd',
      },
    });

    logger.info('New product created successfully');
    return { product, price: product.default_price };
  } catch (error) {
    logger.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Update an existing product
 */
async function updateProduct(id, productData) {
  try {
    checkStripeAvailable();

    if (!id) {
      throw new Error('Product ID is required');
    }

    const { name, description, images, sizes, oldImageUrl } = productData;
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (images) updateData.images = images;
    if (sizes) updateData.metadata = { sizes };

    const updatedProduct = await stripe.products.update(id, updateData);

    // If oldImageUrl is provided and different from new image, delete old image from Firebase
    if (oldImageUrl && images && images[0] && oldImageUrl !== images[0]) {
      const match = oldImageUrl.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        await bucket
          .file(filePath)
          .delete()
          .catch(err => {
            logger.error('Firebase delete error:', err);
          });
      } else {
        logger.warn(
          'Could not extract Firebase file path from URL:',
          oldImageUrl
        );
      }
    }

    logger.info(`Product updated successfully: ${id}`);
    return updatedProduct;
  } catch (error) {
    logger.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Deactivate a product and its prices
 */
async function deactivateProduct(id, imageUrl = null) {
  try {
    checkStripeAvailable();

    if (!id) {
      throw new Error('Product ID is required');
    }

    // Set product as inactive
    const product = await stripe.products.update(id, {
      active: false,
    });

    // Get all prices for this product
    const prices = await stripe.prices.list({ product: id });

    // Set all prices as inactive
    await Promise.all(
      prices.data.map(price =>
        stripe.prices.update(price.id, { active: false })
      )
    );

    // Optionally delete image from Firebase if image URL is provided
    if (imageUrl) {
      const match = imageUrl.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        logger.info('Attempting to delete Firebase file:', filePath);
        await bucket
          .file(filePath)
          .delete()
          .catch(err => {
            logger.error('Firebase delete error:', err);
          });
      } else {
        logger.warn('Could not extract Firebase file path from URL:', imageUrl);
      }
    }

    logger.info(`Product deactivated successfully: ${id}`);
    return { product, prices: prices.data };
  } catch (error) {
    logger.error('Error deactivating product:', error);
    throw error;
  }
}

module.exports = {
  checkStripeAvailable,
  getProducts,
  createCheckoutSession,
  getShippingRate,
  createProduct,
  updateProduct,
  deactivateProduct,
};
