const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

module.exports = app => {
  app.get('/api/user/me', requireAuth, userController.getCurrentUser);
  app.put('/api/user/me', requireAuth, userController.updateUser);
  app.post('/api/auth/initialize', userController.initializeDefaultUser);
};
