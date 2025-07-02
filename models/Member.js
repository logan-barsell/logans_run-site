const mongoose = require('mongoose');
const { Schema } = mongoose;

const MemberSchema = new Schema({
  name: String,
  role: String,
  bioPic: String,
  facebook: String,
  instagram: String,
  tiktok: String,
  youtube: String,
  x: String,
});

const Member = mongoose.model('Members', MemberSchema);

module.exports = Member;
