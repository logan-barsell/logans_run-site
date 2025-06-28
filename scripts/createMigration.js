const fs = require('fs');
const path = require('path');

// Get migration name from command line
const migrationName = process.argv[2];
const migrationVersion = process.argv[3];

if (!migrationName || !migrationVersion) {
  console.log(
    'Usage: node scripts/createMigration.js "Migration Name" version'
  );
  console.log('Example: node scripts/createMigration.js "Add new field" 2');
  process.exit(1);
}

const migrationTemplate = `// Migration ${migrationVersion}: ${migrationName}
const Theme = require('../models/Theme');

module.exports = {
  version: ${migrationVersion},
  name: '${migrationName}',
  run: async () => {
    // TODO: Add your migration logic here
    // Example:
    // const themes = await Theme.find({ newField: { $exists: false } });
    // for (const theme of themes) {
    //   theme.newField = 'default value';
    //   await theme.save();
    // }
    console.log('Applied migration: ${migrationName}');
  }
};`;

const migrationPath = path.join(
  __dirname,
  '..',
  'migrations',
  `migration-${migrationVersion}.js`
);
fs.writeFileSync(migrationPath, migrationTemplate);

console.log(`✓ Created migration: ${migrationPath}`);
console.log(
  "Don't forget to add it to the migrations array in migrationRunner.js!"
);
