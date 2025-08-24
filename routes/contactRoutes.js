const contactController = require('../controllers/contactController');

module.exports = app => {
  app.get('/api/getContactInfo', contactController.getContactInfo);
  app.post('/api/updateContact', contactController.updateContact);
};
