# Database Migration Guide

This guide explains how to use the automated migration system to handle database schema changes safely and consistently.

## Overview

The migration system automatically applies database schema changes when the server starts, ensuring that:

- All environments (dev, staging, production) have consistent schemas
- Schema changes are version-controlled and tracked
- No manual database intervention is required
- Changes are applied safely and only once

## How It Works

1. **Server Startup**: When the server starts, it automatically runs pending migrations
2. **Schema Validation**: After migrations, it validates all schemas and auto-fixes issues
3. **Tracking**: Applied migrations are recorded in the database to prevent re-running
4. **Logging**: All migration activities are logged for debugging

## Adding New Fields to Models

### Step 1: Update the Model Schema

Edit your model file (e.g., `models/Theme.js`):

```javascript
const ThemeSchema = new Schema({
  // ... existing fields
  newField: { type: String, default: 'default value' },
});
```

### Step 2: Create a Migration

Use the migration generator script:

```bash
node scripts/createMigration.js "Add new field" 2
```

This creates a new file: `migrations/migration-2.js`

### Step 3: Edit the Migration

Open the generated migration file and add your logic:

```javascript
// Migration 2: Add new field
const Theme = require('../models/Theme');

module.exports = {
  version: 2,
  name: 'Add new field',
  run: async () => {
    // Find all documents missing the new field
    const themes = await Theme.find({ newField: { $exists: false } });

    // Update each document
    for (const theme of themes) {
      theme.newField = 'default value';
      await theme.save();
    }

    console.log(`Updated ${themes.length} themes with new field`);
  },
};
```

### Step 4: Register the Migration

Add the migration to `migrations/migrationRunner.js`:

```javascript
const migration1 = require('./migration-1');
const migration2 = require('./migration-2');

const migrations = [
  migration1,
  migration2, // Add your new migration here
];
```

### Step 5: Deploy

Deploy your changes. The migration will run automatically on server startup.

## Common Migration Patterns

### Adding a Field with Default Value

```javascript
run: async () => {
  const documents = await Model.find({ newField: { $exists: false } });
  for (const doc of documents) {
    doc.newField = 'default value';
    await doc.save();
  }
};
```

### Updating Existing Data

```javascript
run: async () => {
  const documents = await Model.find({ oldField: { $exists: true } });
  for (const doc of documents) {
    doc.newField = doc.oldField; // Copy old value to new field
    await doc.save();
  }
};
```

### Removing a Field

```javascript
run: async () => {
  await Model.updateMany({}, { $unset: { oldField: 1 } });
};
```

### Complex Data Transformations

```javascript
run: async () => {
  const documents = await Model.find({});
  for (const doc of documents) {
    // Transform data as needed
    doc.transformedField = doc.oldField.toUpperCase();
    await doc.save();
  }
};
```

## Schema Validation

The system also includes automatic schema validation that:

- Checks for missing required fields
- Applies default values
- Fixes schema inconsistencies
- Logs all auto-fixes

### Adding Schema Validation

To add validation for a new model, edit `utils/schemaValidator.js`:

```javascript
const schemaValidators = {
  // ... existing validators

  validateNewModel: async () => {
    const documents = await NewModel.find();
    for (const doc of documents) {
      let needsUpdate = false;

      if (!doc.requiredField) {
        doc.requiredField = 'default value';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await doc.save();
      }
    }
  },
};
```

Then add it to the `validateAllSchemas` function:

```javascript
async function validateAllSchemas() {
  await schemaValidators.validateTheme();
  await schemaValidators.validateNewModel(); // Add this line
}
```

## Troubleshooting

### Migration Not Running

1. **Check server logs** for migration output
2. **Verify migration is registered** in `migrationRunner.js`
3. **Check migration version** - must be higher than last applied
4. **Ensure database connection** is working

### Migration Fails

1. **Check error logs** for specific failure reason
2. **Verify migration logic** - test locally first
3. **Check database permissions** - ensure write access
4. **Rollback if needed** - manually fix database state

### Schema Validation Issues

1. **Check validation logs** for auto-fixes applied
2. **Verify model schema** matches validation logic
3. **Test locally** before deploying

## Best Practices

### Migration Design

- **Keep migrations small** - one logical change per migration
- **Make migrations idempotent** - safe to run multiple times
- **Test migrations locally** before deploying
- **Use descriptive names** for migrations
- **Include rollback logic** for complex migrations

### Version Management

- **Increment version numbers** sequentially
- **Never reuse version numbers**
- **Document breaking changes**
- **Coordinate with team** on migration versions

### Testing

- **Test migrations locally** with production-like data
- **Verify schema validation** works correctly
- **Check migration logs** for expected output
- **Test rollback procedures** if applicable

## Migration Commands

### Create New Migration

```bash
node scripts/createMigration.js "Description" version_number
```

### Check Migration Status

```bash
# Check database for applied migrations
db.migrations.find().sort({version: 1})
```

### Manual Migration (Emergency)

```bash
# Connect to database and run migration manually
node -e "
const mongoose = require('mongoose');
const { runMigrations } = require('./migrations/migrationRunner');
mongoose.connect('your_connection_string').then(() => {
  runMigrations().then(() => process.exit(0));
});
"
```

## File Structure

```
├── migrations/
│   ├── migrationRunner.js      # Main migration orchestrator
│   ├── migration-1.js          # Individual migration files
│   └── migration-2.js
├── utils/
│   └── schemaValidator.js      # Schema validation logic
├── scripts/
│   └── createMigration.js      # Migration generator
└── docs/
    └── MIGRATION_GUIDE.md      # This file
```

## Support

If you encounter issues:

1. **Check server logs** for detailed error messages
2. **Review this guide** for common solutions
3. **Test locally** to reproduce the issue
4. **Document the problem** for future reference

Remember: The migration system is designed to be safe and automatic. When in doubt, test locally first!
