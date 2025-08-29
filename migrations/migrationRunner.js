const mongoose = require('mongoose');
const Theme = require('../models/Theme');

// Migration registry - add new migrations here
const migrations = [
  {
    version: 1,
    name: 'Add paceTheme field',
    run: async () => {
      const themes = await Theme.find({ paceTheme: { $exists: false } });
      for (const theme of themes) {
        theme.paceTheme = 'center-atom';
        await theme.save();
      }
      console.log(`Applied migration: ${migrations[0].name}`);
    },
  },
  {
    version: 2,
    name: 'Add greeting and introduction fields',
    run: async () => {
      const themes = await Theme.find({
        $or: [
          { greeting: { $exists: false } },
          { introduction: { $exists: false } },
        ],
      });
      for (const theme of themes) {
        if (!theme.greeting) {
          theme.greeting = 'HELLO.';
        }
        if (!theme.introduction) {
          theme.introduction = 'Welcome to our site';
        }
        await theme.save();
      }
      console.log(`Applied migration: ${migrations[1].name}`);
    },
  },
  // Add future migrations here
  // {
  //   version: 3,
  //   name: 'Add new field',
  //   run: async () => {
  //     // Migration logic
  //   }
  // }
];

// Migration tracking schema
const MigrationSchema = new mongoose.Schema({
  version: { type: Number, required: true },
  name: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});

const Migration = mongoose.model('Migration', MigrationSchema);

// Run migrations
async function runMigrations() {
  try {
    // Get applied migrations
    const appliedMigrations = await Migration.find().sort({ version: 1 });
    const appliedVersions = appliedMigrations.map(m => m.version);

    // Find pending migrations
    const pendingMigrations = migrations.filter(
      m => !appliedVersions.includes(m.version)
    );

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations');
      return;
    }

    console.log(`Running ${pendingMigrations.length} migrations...`);

    // Run pending migrations
    for (const migration of pendingMigrations) {
      await migration.run();

      // Record migration as applied
      await Migration.create({
        version: migration.version,
        name: migration.name,
      });

      console.log(
        `✓ Applied migration v${migration.version}: ${migration.name}`
      );
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

module.exports = { runMigrations };
