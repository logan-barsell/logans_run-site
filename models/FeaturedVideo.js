const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeaturedVideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoType: { type: String, enum: ['youtube', 'upload'], default: 'youtube' },
  displayMode: { type: String, enum: ['full', 'videoOnly'], default: 'full' },
  youtubeLink: { type: String, required: true },
  videoFile: { type: String }, // Firebase Storage URL for uploaded videos
  videoThumbnail: { type: String }, // Firebase Storage URL for video thumbnail
  videoDuration: { type: Number }, // Duration in seconds
  videoFileSize: { type: Number }, // File size in bytes
  startTime: { type: Number },
  endTime: { type: Number },
  releaseDate: { type: Date, required: true },
});

const FeaturedVideo = mongoose.model('FeaturedVideo', FeaturedVideoSchema);

module.exports = FeaturedVideo;
