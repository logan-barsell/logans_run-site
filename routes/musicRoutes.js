const musicController = require('../controllers/musicController');

module.exports = app => {
  app.post('/api/addPlayer', musicController.addPlayer);
  app.post('/api/updatePlayer', musicController.updatePlayer);
  app.get('/api/deletePlayer/:id', musicController.deletePlayer);
  app.get('/api/getPlayer/:id', musicController.getPlayer);
  app.get('/api/getPlayers', musicController.getPlayers);
};
