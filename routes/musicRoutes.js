const SpotifyPlayer = require('../models/SpotifyPlayer');

module.exports = app => {

    app.post('/api/addPlayer', async (req, res) => {
        try {
            const newPlayer = new SpotifyPlayer(req.body);
            await newPlayer.save();
            res.status(200).send(newPlayer);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.post('/api/updatePlayer', async (req, res) => {
        try {
            const updatedPlayer = req.body;
            await SpotifyPlayer.updateOne({ _id: updatedPlayer._id }, updatedPlayer);
            res.status(200).send(updatedPlayer);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.get('/api/deletePlayer/:id', async (req, res) => {
        try {
            await SpotifyPlayer.findByIdAndDelete(req.params.id);
            res.status(200).send('deleted');
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.get('/api/getPlayer/:id', async (req, res) => {
        try {
            const player = await SpotifyPlayer.findById(req.params.id);
            res.status(200).send(player);
        } catch (err) {
            res.status(500).send(err);
        }
    });

    app.get('/api/getPlayers', async (req, res) => {
        try {
            const players = await SpotifyPlayer.find().sort({date: -1});
            res.status(200).send(players);
        } catch (err) {
            res.status(500).send(err);
        }
    });
}