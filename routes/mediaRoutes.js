const mediaController = require('../controllers/mediaController');

module.exports = app => {
  app.post('/api/updateVideo', mediaController.updateVideo);
  app.get('/api/deleteVideo/:id', mediaController.deleteVideo);
  app.get('/api/getVideos', mediaController.getVideos);
  app.post('/api/addVideo', mediaController.addVideo);
  app.get('/api/getMediaImages', mediaController.getMediaImages);
  app.get('/api/removeMediaImage/:id', mediaController.removeMediaImage);
  app.post('/api/addMediaImage', mediaController.addMediaImage);
};
