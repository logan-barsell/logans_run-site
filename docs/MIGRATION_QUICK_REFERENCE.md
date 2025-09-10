# Migration Quick Reference

## Quick Commands

### Create & Apply Migration (dev)

```bash
npx prisma migrate dev --name <change-name>
```

### Apply Pending Migrations (staging/prod)

```bash
npx prisma migrate deploy
```

### Inspect Data

```bash
npx prisma studio
```

## Common Patterns

### Add Column

```prisma
model Theme {
  id        String @id @default(uuid())
  tenantId  String
  // ...
  newField  String? @db.Text
}
```

### Add Composite Unique

```prisma
@@unique([tenantId, email], name: "tenantId_email")
```

### Add Relation

```prisma
userId   String
user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)
```

## File Locations

- **Schema**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`
- **Prisma Client**: `prisma/index.js`
- **Full Guide**: `docs/MIGRATION_GUIDE.md`

## Workflow

1. Update model(s) in `schema.prisma`
2. Create migration: `npx prisma migrate dev --name <name>`
3. Verify locally; commit migration files
4. Deploy; run `npx prisma migrate deploy` on target env

## Troubleshooting

- **Client missing**: `npx prisma generate`
- **Migration failed**: Inspect SQL in `prisma/migrations/`, verify `DATABASE_URL`
- **Unique constraint**: Confirm indexes in schema

## Best Practices

- ✅ Keep migrations small and focused
- ✅ Test locally before deploying
- ✅ Use descriptive names
- ✅ Prefer declarative schema; avoid manual SQL when possible
- ❌ Don’t edit generated SQL after commit
