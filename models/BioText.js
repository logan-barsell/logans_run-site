const mongoose = require('mongoose');
const { Schema } = mongoose;

const BioSchema = new Schema({
  name: String,
  text: String,
});

const Bio = mongoose.model('Bio', BioSchema);

module.exports = Bio;
