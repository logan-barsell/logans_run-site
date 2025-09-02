const mongoose = require('mongoose');
const { Schema } = mongoose;

const BioSchema = new Schema({
  name: String,
  text: String,
  imageType: {
    type: String,
    enum: ['band-logo', 'custom-image'],
    default: 'band-logo',
  },
  customImageUrl: {
    type: String,
    default: null,
  },
});

const Bio = mongoose.model('Bio', BioSchema);

module.exports = Bio;
