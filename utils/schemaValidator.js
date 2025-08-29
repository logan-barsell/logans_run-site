const Theme = require('../models/Theme');

// Schema validation and auto-fix functions
const schemaValidators = {
  // Theme schema validator
  validateTheme: async () => {
    const theme = await Theme.findOne();
    if (!theme) return;

    let needsUpdate = false;
    const updates = {};

    // Check for missing fields and set defaults
    if (!theme.paceTheme) {
      updates.paceTheme = 'center-atom';
      needsUpdate = true;
    }

    if (!theme.secondaryFont) {
      updates.secondaryFont = 'Courier New';
      needsUpdate = true;
    }

    if (!theme.greeting) {
      updates.greeting = 'HELLO.';
      needsUpdate = true;
    }
    if (!theme.introduction) {
      updates.introduction = 'Welcome to our site';
      needsUpdate = true;
    }

    if (!theme.siteTitle) {
      updates.siteTitle = 'Band Site';
      needsUpdate = true;
    }

    if (!theme.primaryColor) {
      updates.primaryColor = '#e3ff05';
      needsUpdate = true;
    }

    if (!theme.secondaryColor) {
      updates.secondaryColor = '#f08080';
      needsUpdate = true;
    }

    if (!theme.primaryFont) {
      updates.primaryFont = 'SprayPaint';
      needsUpdate = true;
    }

    // Apply updates if needed
    if (needsUpdate) {
      Object.assign(theme, updates);
      await theme.save();
      console.log('✓ Auto-fixed theme schema:', Object.keys(updates));
    }
  },
};

// Run all schema validations
async function validateAllSchemas() {
  try {
    console.log('Validating schemas...');
    await schemaValidators.validateTheme();
    console.log('✓ All schemas validated');
  } catch (error) {
    console.error('Schema validation failed:', error);
    throw error;
  }
}

module.exports = { validateAllSchemas, schemaValidators };
