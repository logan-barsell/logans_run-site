const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const MerchConfigService = require('./merchConfigService');
const ThemeService = require('./themeService');

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
    throw new AppError('Stripe is not configured', 503);
  }
  return true;
}

/**
 * Get all products from Stripe
 */
async function getProducts(tenantId) {
  try {
    // Ensure tenant has stripe merch configured
    const merch = await MerchConfigService.getMerchConfig(tenantId);
    if (!merch || merch.storeType !== 'stripe') {
      throw new AppError('Stripe store is not configured for tenant', 400);
    }
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
    logger.error('❌ Error fetching products:', error);
    throw new AppError(
      error.message || 'Error fetching products',
      error.statusCode || 500
    );
  }
}

/**
 * Create a checkout session
 */
async function createCheckoutSession(tenantId, products) {
  try {
    const merch = await MerchConfigService.getMerchConfig(tenantId);
    if (!merch || merch.storeType !== 'stripe') {
      throw new AppError('Stripe store is not configured for tenant', 400);
    }
    checkStripeAvailable();

    const productlist = [];
    await Promise.all(
      products.map(async product => {
        const price = await stripe.prices.retrieve(product.price);
        productlist.push({
          price: product.price,
          quantity: product.quantity,
        });
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: productlist,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return session;
  } catch (error) {
    logger.error('❌ Error creating checkout session:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error.message || 'Error creating checkout session',
      error.statusCode || 500
    );
  }
}

/**
 * Get shipping rate
 */
async function getShippingRate(tenantId) {
  try {
    const merch = await MerchConfigService.getMerchConfig(tenantId);
    if (!merch || merch.storeType !== 'stripe') {
      throw new AppError('Stripe store is not configured for tenant', 400);
    }
    checkStripeAvailable();

    const shippingRate = await stripe.shippingRates.list({
      limit: 1,
    });

    return shippingRate.data[0] || null;
  } catch (error) {
    logger.error('❌ Error fetching shipping rate:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error.message || 'Error fetching shipping rate',
      error.statusCode || 500
    );
  }
}

/**
 * Create a new product
 */
async function createProduct(tenantId, productData) {
  try {
    const merch = await MerchConfigService.getMerchConfig(tenantId);
    if (!merch || merch.storeType !== 'stripe') {
      throw new AppError('Stripe store is not configured for tenant', 400);
    }
    checkStripeAvailable();

    if (!productData.name || !productData.price) {
      throw new AppError('Product name and price are required', 400);
    }

    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description || '',
      images: productData.images || [],
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(productData.price * 100), // Convert to cents
      currency: 'usd',
    });

    return { product, price };
  } catch (error) {
    logger.error('❌ Error creating product:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error.message || 'Error creating product',
      error.statusCode || 500
    );
  }
}

/**
 * Update an existing product
 */
async function updateProduct(tenantId, productId, updateData) {
  try {
    const merch = await MerchConfigService.getMerchConfig(tenantId);
    if (!merch || merch.storeType !== 'stripe') {
      throw new AppError('Stripe store is not configured for tenant', 400);
    }
    checkStripeAvailable();

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const product = await stripe.products.update(productId, updateData);
    return product;
  } catch (error) {
    logger.error('❌ Error updating product:', error);
    throw new AppError(
      error.message || 'Error updating product',
      error.statusCode || 500
    );
  }
}

/**
 * Delete a product
 */
async function deleteProduct(tenantId, productId) {
  try {
    const merch = await MerchConfigService.getMerchConfig(tenantId);
    if (!merch || merch.storeType !== 'stripe') {
      throw new AppError('Stripe store is not configured for tenant', 400);
    }
    checkStripeAvailable();

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const product = await stripe.products.del(productId);
    return product;
  } catch (error) {
    logger.error('❌ Error deleting product:', error);
    throw new AppError(
      error.message || 'Error deleting product',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getProducts,
  createCheckoutSession,
  getShippingRate,
  createProduct,
  updateProduct,
  deleteProduct,
};
