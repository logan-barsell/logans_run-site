const mongoose = require('mongoose');
require('dotenv').config();
const keys = require('../config/keys');

// Connect to MongoDB
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Theme = require('../models/Theme');

async function fixSecondaryFont() {
  try {
    console.log('🔄 Starting migration: Fixing secondaryFont values...');

    // Find all themes with invalid secondaryFont values
    const themes = await Theme.find({
      secondaryFont: {
        $nin: [
          'Anton',
          'ArchitectsDaughter',
          'BebasNeue',
          'ComicNeue',
          'Creepster',
          'IndieFlower',
          'Kalam',
          'Lobster',
          'Orbitron',
          'Oswald',
          'Pacifico',
          'Righteous',
          'RobotoCondensed',
          'Sancreek',
          'sprayPaint',
          'VT323',
        ],
      },
    });

    console.log(
      `Found ${themes.length} themes with invalid secondaryFont values`
    );

    // Update them to use RobotoCondensed
    for (const theme of themes) {
      console.log(
        `Fixing theme ${theme._id}: ${theme.secondaryFont} → RobotoCondensed`
      );
      theme.secondaryFont = 'RobotoCondensed';
      await theme.save();
    }

    console.log(
      '✅ Migration completed: All invalid secondaryFont values fixed'
    );

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

fixSecondaryFont();
