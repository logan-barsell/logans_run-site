const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

router.post('/updateVideo', mediaController.updateVideo);
router.get('/deleteVideo/:id', mediaController.deleteVideo);
router.get('/getVideos', mediaController.getVideos);
router.post('/addVideo', mediaController.addVideo);
router.get('/getMediaImages', mediaController.getMediaImages);
router.get('/removeMediaImage/:id', mediaController.removeMediaImage);
router.post('/addMediaImage', mediaController.addMediaImage);

module.exports = router;
