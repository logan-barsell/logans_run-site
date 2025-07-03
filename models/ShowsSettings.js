const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShowsSettingsSchema = new Schema({
  showSystem: { type: String, default: 'custom' }, // 'custom' or 'bandsintown'
  bandsintownArtist: { type: String, default: '' },
});

const ShowsSettings = mongoose.model('ShowsSettings', ShowsSettingsSchema);

module.exports = ShowsSettings;
