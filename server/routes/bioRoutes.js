const express = require('express');
const router = express.Router();
const bioController = require('../controllers/bioController');
const { requireAuth } = require('../middleware/auth');

// Public routes (used by public site)
router.get('/bio', bioController.getBio);
router.get('/members', bioController.getMembers);

// Admin routes (require authentication)
router.post('/updateBio', requireAuth, bioController.updateBio);
router.post('/addMember', requireAuth, bioController.addMember);
router.get('/deleteMember/:id', requireAuth, bioController.deleteMember);
router.post('/updateMember/:id', requireAuth, bioController.updateMember);

module.exports = router;
