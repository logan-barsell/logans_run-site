const BillingService = require('../services/billingService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all products
 */
async function getProducts(req, res, next) {
  try {
    const products = await BillingService.getProducts();
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    if (error.message === 'Stripe is not configured') {
      return next(new AppError('Stripe is not configured', 503));
    }
    next(new AppError('Failed to fetch products', 500));
  }
}

/**
 * Create checkout session
 */
async function createCheckoutSession(req, res, next) {
  try {
    const products = JSON.parse(Object.keys(req.body)[0]);
    const session = await BillingService.createCheckoutSession(products);
    res.json({
      success: true,
      data: { url: session.url },
    });
  } catch (error) {
    if (error.message === 'Stripe is not configured') {
      return next(new AppError('Stripe is not configured', 503));
    }
    next(new AppError('Failed to create checkout session', 500));
  }
}

/**
 * Get shipping rate
 */
async function getShipping(req, res, next) {
  try {
    const shippingRate = await BillingService.getShippingRate();
    res.json({
      success: true,
      data: shippingRate,
    });
  } catch (error) {
    if (error.message === 'Stripe is not configured') {
      return next(new AppError('Stripe is not configured', 503));
    }
    next(new AppError('Failed to fetch shipping rate', 500));
  }
}

/**
 * Create a new product
 */
async function createProduct(req, res, next) {
  try {
    const result = await BillingService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Stripe is not configured') {
      return next(new AppError('Stripe is not configured', 503));
    }
    if (error.message === 'Product name and price are required') {
      return next(new AppError('Product name and price are required', 400));
    }
    next(new AppError('Failed to create product', 500));
  }
}

/**
 * Update an existing product
 */
async function updateProduct(req, res, next) {
  try {
    const result = await BillingService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Stripe is not configured') {
      return next(new AppError('Stripe is not configured', 503));
    }
    if (error.message === 'Product ID is required') {
      return next(new AppError('Product ID is required', 400));
    }
    next(new AppError('Failed to update product', 500));
  }
}

/**
 * Deactivate a product
 */
async function deactivateProduct(req, res, next) {
  try {
    const imageUrl = req.query.imageUrl;
    const result = await BillingService.deactivateProduct(
      req.params.id,
      imageUrl
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error.message === 'Stripe is not configured') {
      return next(new AppError('Stripe is not configured', 503));
    }
    if (error.message === 'Product ID is required') {
      return next(new AppError('Product ID is required', 400));
    }
    next(new AppError('Failed to deactivate product', 500));
  }
}

module.exports = {
  getProducts,
  createCheckoutSession,
  getShipping,
  createProduct,
  updateProduct,
  deactivateProduct,
};
