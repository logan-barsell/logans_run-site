const mongoose = require('mongoose');
const { Schema } = mongoose;

const MemberSchema = new Schema({
  name: String,
  role: String,
  instaTag: String,
  bioPic: String,
});

const Member = mongoose.model('Members', MemberSchema);

module.exports = Member;
