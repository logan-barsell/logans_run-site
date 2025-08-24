const billingController = require('../controllers/billingController');

module.exports = app => {
  app.get('/api/products', billingController.getProducts);
  app.post(
    '/api/create-checkout-session',
    billingController.createCheckoutSession
  );
  app.get('/api/shipping', billingController.getShipping);
  app.post('/api/products', billingController.createProduct);
  app.put('/api/products/:id', billingController.updateProduct);
  app.delete('/api/products/:id', billingController.deactivateProduct);
};
