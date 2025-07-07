const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Used as the admin user model for authentication (single admin only). Password is hashed before storing.

const ContactSchema = new Schema({
  name: String,
  phone: String,
  email: {
    type: String,
    default: process.env.ADMIN_EMAIL,
  },
  password: {
    type: String,
    default: bcrypt.hashSync(process.env.DEFAULT_PASSWORD || 'admin', 10),
  },
  facebook: String,
  instagram: String,
  youtube: String,
  soundcloud: String,
  spotify: String,
  x: String,
  tiktok: String,
});

const ContactInfo = mongoose.model('Contact', ContactSchema);

module.exports = ContactInfo;
