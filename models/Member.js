const mongoose = require('mongoose');
const { Schema } = mongoose;
const ImageSchema = require('./Image');


const MemberSchema = new Schema({
  name: String,
  role: String,
  instaTag: String,
  bioPic: ImageSchema
});

const Member = mongoose.model('Members', MemberSchema);

module.exports = Member;