# Migration Quick Reference

## Quick Commands

### Create New Migration

```bash
node scripts/createMigration.js "Description" version_number
```

### Check Applied Migrations

```bash
# In MongoDB shell
db.migrations.find().sort({version: 1})
```

## Common Patterns

### Add Field with Default

```javascript
run: async () => {
  const docs = await Model.find({ newField: { $exists: false } });
  for (const doc of docs) {
    doc.newField = 'default';
    await doc.save();
  }
};
```

### Update Existing Data

```javascript
run: async () => {
  const docs = await Model.find({ oldField: { $exists: true } });
  for (const doc of docs) {
    doc.newField = doc.oldField;
    await doc.save();
  }
};
```

### Remove Field

```javascript
run: async () => {
  await Model.updateMany({}, { $unset: { oldField: 1 } });
};
```

## File Locations

- **Migration Runner**: `migrations/migrationRunner.js`
- **Schema Validator**: `utils/schemaValidator.js`
- **Migration Generator**: `scripts/createMigration.js`
- **Full Guide**: `docs/MIGRATION_GUIDE.md`

## Workflow

1. **Update Model** → Add field to schema
2. **Create Migration** → `node scripts/createMigration.js "Description" version`
3. **Edit Migration** → Add logic to migration file
4. **Register Migration** → Add to migrationRunner.js
5. **Deploy** → Migration runs automatically

## Troubleshooting

- **Not Running**: Check server logs, verify registration
- **Failing**: Test locally, check database permissions
- **Schema Issues**: Check validation logs, verify model schema

## Best Practices

- ✅ Keep migrations small and focused
- ✅ Test locally before deploying
- ✅ Use descriptive names
- ✅ Increment version numbers sequentially
- ❌ Never reuse version numbers
- ❌ Don't skip testing
