const mongoose = require('mongoose');
require('dotenv').config();
const keys = require('../config/keys');

// Connect to MongoDB
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Theme = require('../models/Theme');

async function addBrownTheme() {
  try {
    console.log('🔄 Starting migration: Adding brown theme...');

    // The brown theme is already added to the model enum
    // This migration is mainly for documentation and to ensure the model is updated

    console.log('✅ Migration completed: Brown theme is now available');
    console.log(
      '📝 Available themes: black, metal, punk, indie, electronic, blues, burgundy, dark-gray, brown, pink, white'
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addBrownTheme();
