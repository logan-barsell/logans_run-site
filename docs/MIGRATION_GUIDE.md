# Prisma + Neon Postgres Migration Guide

This guide replaces all legacy MongoDB/Mongoose content. It documents how we design, run, and deploy schema changes using Prisma with a Neon (Postgres) database in a multi-tenant app.

## Stack

- ORM: Prisma
- DB: Postgres (Neon)
- Multi-tenancy: Row-level scoping via `tenantId` and `withTenant(tenantId, tx)`
- Migrations: Prisma Migrate (SQL in `prisma/migrations/`)

## Environment

Add your Neon connection strings to `.env`:

```bash
# App runtime (RLS enforced role without BYPASSRLS)
DATABASE_URL="postgresql://app_user:<password>@<host>/<database>?sslmode=require"

# Owner (for migrations only)
OWNER_DATABASE_URL="postgresql://neondb_owner:<password>@<host>/<database>?sslmode=require"
```

Prisma commands read `DATABASE_URL`. For migrations, temporarily override:

```bash
DATABASE_URL=$OWNER_DATABASE_URL npx prisma migrate deploy --schema db/prisma/schema.prisma
```

## Project Layout

- `prisma/schema.prisma` – models and relations (single source of truth)
- `prisma/migrations/*` – auto-generated SQL migrations
- `prisma/index.js` – PrismaClient export
- `db/withTenant.js` – helper that scopes all queries by tenant

## Multi-Tenancy Pattern

- Controllers must pass `tenantId` as the first arg to services.
- Services wrap all DB operations in `withTenant(tenantId, tx)`.
- Models include `tenantId` and composite uniques (e.g., `tenantId_email`).

Example:

```js
return withTenant(tenantId, async tx => {
  return tx.newsletterSubscriber.findUnique({
    where: { tenantId_email: { tenantId, email } },
  });
});
```

## Local Development Workflow

1. Edit models in `prisma/schema.prisma`.
2. Create & apply a migration locally:

```bash
npx prisma migrate dev --name <change-name>
```

3. Inspect data if needed:

```bash
npx prisma studio
```

4. Run the app and verify:

```bash
npm run dev
```

What `migrate dev` does:

- Validates schema
- Creates SQL under `prisma/migrations/<timestamp>_<name>`
- Applies to local DB
- Regenerates Prisma Client

## CI/Production Deployment

Commit migrations to VCS. On deploy (CI or server):

```bash
DATABASE_URL=$OWNER_DATABASE_URL npx prisma migrate deploy
```

This applies any pending SQL migrations using the owner connection while keeping the app runtime URL unchanged.

## Common Changes

- Add column: update model, run `migrate dev`
- Add unique/composite index: define in model (e.g., `@@unique([tenantId, email], name: "tenantId_email")`), run `migrate dev`
- Add relation: add FK fields and relation blocks; confirm `onDelete`/`onUpdate`

## Health Check

We verify DB connectivity using a lightweight query:

```js
await prisma.$queryRaw`SELECT 1`;
```

If it fails, health status becomes `DEGRADED` (HTTP 503).

## Error Handling

- Duplicate key: Prisma code `P2002` (generic fallback supported)
- Not found: perform `findUnique` first; throw `new AppError('...', 404)`
- All services/controllers must avoid Mongoose-specific logic

## Data Seeding (Dev Only)

```bash
node scripts/seed-core-dev.js
```

Use for non-critical development data only.

## Converting Legacy Code

For any stragglers in feature branches:

- Replace `_id` with `id`
- Move queries to services using Prisma Client
- Add `tenantId` and wrap in `withTenant`

## Troubleshooting

- Client missing: `npx prisma generate`
- Migration failed: inspect SQL in `prisma/migrations/`, verify `DATABASE_URL`, rerun `migrate dev` (dev) or `migrate deploy` (prod)
- Unique constraint errors: confirm indexes in schema

## Useful Commands

```bash
# Create & apply a migration locally
npx prisma migrate dev --name <name>

# Apply pending migrations (staging/prod)
npx prisma migrate deploy

# Inspect data
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Reset dev DB (dangerous, dev only)
npx prisma migrate reset
```

---

All schema work must go through Prisma migrations. MongoDB/Mongoose docs are deprecated and removed.
