const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/getHomeImages', homeController.getHomeImages);
router.get('/removeImage/:id', homeController.removeImage);
router.post('/addHomeImage', homeController.addHomeImage);
router.post('/addShow', homeController.addShow);
router.get('/shows', homeController.getShows);
router.post('/updateShow/:id', homeController.updateShow);
router.get('/deleteShow/:id', homeController.deleteShow);

module.exports = router;
