const express = require('express');
const router = express.Router();
const bioController = require('../controllers/bioController');

router.get('/bio', bioController.getBio);
router.post('/updateBio', bioController.updateBio);
router.post('/addMember', bioController.addMember);
router.get('/deleteMember/:id', bioController.deleteMember);
router.get('/members', bioController.getMembers);
router.post('/updateMember/:id', bioController.updateMember);

module.exports = router;
