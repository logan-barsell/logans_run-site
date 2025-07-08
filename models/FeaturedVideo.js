const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeaturedVideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  youtubeLink: { type: String, required: true },
  startTime: { type: Number },
  endTime: { type: Number },
  releaseDate: { type: Date, required: true },
});

const FeaturedVideo = mongoose.model('FeaturedVideo', FeaturedVideoSchema);

module.exports = FeaturedVideo;
