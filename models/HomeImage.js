const mongoose = require('mongoose');
const { Schema } = mongoose;

const HomeImageSchema = new Schema({
    name: String,
    imgLink: String
});

const HomeImage = mongoose.model('HomeImages', HomeImageSchema);

module.exports = HomeImage;