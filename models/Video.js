const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoSchema = new Schema({
    category: String,
    title: String,
    date: Date,
    link: String,
    embedLink: String
});

const Video = mongoose.model('Videos', VideoSchema);

module.exports = Video;