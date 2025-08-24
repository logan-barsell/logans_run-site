const bioController = require('../controllers/bioController');

module.exports = app => {
  app.get('/api/bio', bioController.getBio);
  app.post('/api/updateBio', bioController.updateBio);
  app.post('/api/addMember', bioController.addMember);
  app.get('/api/deleteMember/:id', bioController.deleteMember);
  app.get('/api/members', bioController.getMembers);
  app.post('/api/updateMember/:id', bioController.updateMember);
};
