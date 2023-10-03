const mongoose = require('mongoose');
const { Schema } = mongoose;

const MediaImageSchema = new Schema({
    name: String,
    imgLink: String
});

const MediaImage = mongoose.model('MediaImages', MediaImageSchema);

module.exports = MediaImage;