const mongoose = require('mongoose');
require('dotenv').config();

const keys = require('../config/keys');
const { runMigrations } = require('../migrations/migrationRunner');
const { validateAllSchemas } = require('../utils/schemaValidator');
const Theme = require('../models/Theme');

async function deployCheck() {
  try {
    console.log('🚀 Starting deployment check...');

    // Connect to database
    console.log('📡 Connecting to database...');
    await mongoose.connect(keys.mongoURI);
    console.log('✅ Connected to database');

    // Run migrations
    console.log('🔄 Running migrations...');
    await runMigrations();

    // Run schema validation
    console.log('🔍 Validating schemas...');
    await validateAllSchemas();

    // Check final state
    console.log('📊 Checking final database state...');
    const theme = await Theme.findOne();

    if (theme) {
      console.log('✅ Theme document found');
      console.log('📋 Theme fields:', Object.keys(theme.toObject()));
      console.log('🎨 paceTheme:', theme.paceTheme);
      console.log('🎯 All required fields present:', {
        siteTitle: !!theme.siteTitle,
        primaryColor: !!theme.primaryColor,
        secondaryColor: !!theme.secondaryColor,
        primaryFont: !!theme.primaryFont,
        secondaryFont: !!theme.secondaryFont,
        catchPhrase: !!theme.catchPhrase,
        paceTheme: !!theme.paceTheme,
      });
    } else {
      console.log('❌ No theme document found');
    }

    console.log('🎉 Deployment check completed successfully!');
  } catch (error) {
    console.error('❌ Deployment check failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run if called directly
if (require.main === module) {
  deployCheck();
}

module.exports = { deployCheck };
