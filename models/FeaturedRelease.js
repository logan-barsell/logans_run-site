const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeaturedReleaseSchema = new Schema({
  coverImage: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['album', 'single', 'EP', 'LP'] },
  releaseDate: { type: Date, required: true },
  musicLink: { type: String, required: true },
});

const FeaturedRelease = mongoose.model(
  'FeaturedRelease',
  FeaturedReleaseSchema
);

module.exports = FeaturedRelease;
