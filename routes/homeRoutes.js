const homeController = require('../controllers/homeController');

module.exports = app => {
  app.get('/api/getHomeImages', homeController.getHomeImages);
  app.get('/api/removeImage/:id', homeController.removeImage);
  app.post('/api/addHomeImage', homeController.addHomeImage);
  app.post('/api/addShow', homeController.addShow);
  app.get('/api/shows', homeController.getShows);
  app.post('/api/updateShow/:id', homeController.updateShow);
  app.get('/api/deleteShow/:id', homeController.deleteShow);
};
