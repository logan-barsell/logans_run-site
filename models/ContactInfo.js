const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    facebook: String,
    instagram: String,
    youtube: String,
    soundcloud: String,
    spotify: String
});

const ContactInfo = mongoose.model('Contact', ContactSchema);

module.exports = ContactInfo;
