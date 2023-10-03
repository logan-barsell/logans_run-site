const mongoose = require('mongoose');
const { Schema } = mongoose;

const SpotifyPlayerSchema = new Schema({
    title: String,
    date: Date,
    bgColor: String,
    spotifyLink: String,
    embedLink: String,
});

const SpotifyPlayer = mongoose.model('SpotifyPlayers', SpotifyPlayerSchema);

module.exports = SpotifyPlayer;