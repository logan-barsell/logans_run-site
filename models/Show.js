const mongoose = require('mongoose');
const { Schema } = mongoose;
const ImageSchema = require('./Image');

const ShowSchema = new Schema({
  poster: ImageSchema,
  venue: String,
  location: String,
  date: Date,
  doors: {type: Date, required: false},
  showtime: Date,
  doorprice: {type: String, required: false},
  advprice:  {type: String, required: false},
  tixlink: {type: String, required: false}
});

const Show = mongoose.model('Shows', ShowSchema);

module.exports = Show;