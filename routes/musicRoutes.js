const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

router.post('/addPlayer', musicController.addPlayer);
router.post('/updatePlayer', musicController.updatePlayer);
router.get('/deletePlayer/:id', musicController.deletePlayer);
router.get('/getPlayer/:id', musicController.getPlayer);
router.get('/getPlayers', musicController.getPlayers);

module.exports = router;
