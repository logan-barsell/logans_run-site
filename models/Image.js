const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    img: { contentType: String, image: Buffer }
});

module.exports = ImageSchema;