const BillingService = require('../services/billingService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

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
    logger.error('❌ Failed to fetch products:', error);
    next(error);
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
    logger.error('❌ Failed to create checkout session:', error);
    next(error);
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
    logger.error('❌ Failed to fetch shipping rate:', error);
    next(error);
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
    logger.error('❌ Failed to create product:', error);
    next(error);
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
    logger.error('❌ Failed to update product:', error);
    next(error);
  }
}

/**
 * Delete a product
 */
async function deleteProduct(req, res, next) {
  try {
    await BillingService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to delete product:', error);
    next(error);
  }
}

module.exports = {
  getProducts,
  createCheckoutSession,
  getShipping,
  createProduct,
  updateProduct,
  deleteProduct,
};
