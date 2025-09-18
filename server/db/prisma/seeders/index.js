// db/prisma/seeders/index.js
// Main seeder orchestrator - runs all seeders in the correct order
//
// ⚠️  WARNING: These seeders should only be run once during initial setup!
// Running multiple times will cause unique constraint violations.

const { seedBandsyteTenant } = require('./bandsyte-seeder');
const { seedLogansRunTenant } = require('./logans-run-seeder');

async function runAllSeeders() {
  console.log('🚀 Starting database seeding process...');
  console.log('');

  try {
    // Seed Bandsyte tenant (official tenant)
    await seedBandsyteTenant();

    // Seed Logan's Run tenant (example band tenant)
    await seedLogansRunTenant();

    console.log('');
    console.log('✅ All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
    throw error;
  }
}

// Export individual seeders for selective running
module.exports = {
  runAllSeeders,
  seedBandsyteTenant,
  seedLogansRunTenant,
};
