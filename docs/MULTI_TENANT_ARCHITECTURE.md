# Backend Multi‑Tenant Architecture

This document explains how the backend implements multi‑tenant architecture after migrating from MongoDB/Mongoose (single‑tenant) to Neon Postgres with Prisma (multi‑tenant). It covers tenant resolution, data isolation, Prisma usage, controller/service patterns, authentication/session handling, integrations, and operational flows.

## Tenancy Model and Isolation Strategy

- **Strategy**: Single physical Postgres database shared by all tenants; every tenant‑owned record includes a `tenantId` column. Isolation is enforced in the application layer by scoping all Prisma queries within a transaction that sets a Postgres session GUC for the current tenant.
- **Primary keying**: All entities use UUID `String` IDs.
- **Tenant ownership**: Each tenant is a row in `Tenant`; tenant‑scoped tables reference `tenantId` and include appropriate unique constraints and indexes.
- **Singletons per tenant**: Tables that must have at most one row per tenant (e.g., `Theme`, `Bio`, `ContactInfo`, `MerchConfig`, `ShowsSettings`, `User`) have a unique constraint on `tenantId`.
- **Indexes**: Multi‑row tables include helpful indexes (e.g., `Session` has `@@index([tenantId, userId, isActive])`).
- **Row Level Security (RLS)**: Not used. Isolation is provided in the service layer via `withTenant` (see below). No `ENABLE ROW LEVEL SECURITY` or policies exist in migrations.

## Schema Overview (Prisma)

- Schema file: `db/prisma/schema.prisma`.
- Key models:
  - `Tenant`, `TenantDomain` (domain mapping and resolution).
  - `User` (one per tenant; `tenantId` is unique), `Session` (tracks logins with `tenantId`).
  - Content models: `Theme`, `Bio`, `ContactInfo`, `Member`, `Show`, `Video`, `FeaturedVideo`, `FeaturedRelease`, `MediaImage`, `HomeImage`, `MerchConfig`, `ShowsSettings`, `SpotifyPlayer`, `NewsletterSubscriber`.
- Unique constraints ensuring tenancy scoping:
  - `@@unique([tenantId, email])` on `NewsletterSubscriber`.
  - `@unique` on `tenantId` for singleton tables.

## Tenant Resolution (per request)

- Middleware: `middleware/tenant.js` attaches `req.tenantId` by resolving in order:
  1. Dev: `localhost` uses `DEV_TENANT_ID` or header `x-tenant-id`.
  2. Custom domain match in `TenantDomain.domain` → `tenantId`.
  3. Subdomain `<slug>.bandsyte.com` → lookup `Tenant.slug`.
  4. Admin override via `x-tenant-id` header.
- If unresolved, responds `400 { error: 'Tenant not resolved' }`.
- Wiring: Applied globally in `config/middleware.js` before routes.

## Prisma Client and withTenant helper

- Prisma client: `db/prisma/index.js` creates a singleton `PrismaClient` with transaction timeouts.
- Tenancy scoping helper: `db/withTenant.js`:
  - Wraps calls in `prisma.$transaction`.
  - Executes `SELECT set_config('app.tenant_id', '<tenantId>', true)` in the transaction, storing the current tenant in a Postgres GUC.
  - Invokes the provided callback with the transactional Prisma client (`tx`).
  - Retries on `P2028` (transaction timeout) with exponential backoff.
- Services must use `withTenant(tenantId, async tx => { ... })` for any DB access.

## Controllers and Services Pattern

- Controllers read `req.tenantId` set by middleware and pass the `tenantId` to services. Success responses use `res.status().json()`; errors go to the global error handler via `next(error)`.
- Services accept `tenantId` as the first argument and perform all data access using `withTenant` and `tx`.
- Example: `ThemeService.getTheme(tenantId)` and `updateTheme(tenantId, update)` both run inside `withTenant`, with queries like `tx.theme.findUnique({ where: { tenantId } })`.
- All create/update operations explicitly set or constrain `tenantId` to prevent cross‑tenant writes.

## Authentication, Sessions, and Tokens

- `middleware/auth.js` enforces authentication using cookies: `access_token` and `refresh_token`.
- On protected routes, it:
  - Verifies/refreshes tokens.
  - Loads the user via `UserService.findUserById(req.tenantId, decoded.id)`.
  - Validates that the session is active via `SessionService.getCurrentSession(req.tenantId, decoded.sessionId, decoded.id)`.
  - On failure, clears cookies and returns appropriate 401/403 errors.
- Tokens: `services/tokenService.js` issues JWT access tokens (1h) and refresh tokens (7d), storing refresh tokens in Redis keyed by `sessionId`.
- Refresh flow uses `verifyRefreshToken(..., tenantId)` to prevent cross‑tenant refresh and sends tenant‑branded security emails on anomalies.
- Sessions: `Session` table includes `tenantId`; updates and revocations are scoped by `tenantId` in `SessionService` and `TokenService`.

## Email and Theming per Tenant

- Email services (`emailService`, `bandEmailService`, `bandsyteEmailService`) require `tenantId` for branding.
- Theme is fetched by `tenantId` to derive site title and colors used in templates.
- Errors are thrown if `tenantId` is missing for actions that require theming.

## Media Storage per Tenant

- Client utilities enforce tenant‑aware paths in Firebase Storage:
  - Images: `${tenantId}/images/<filename>`.
  - Videos: `${tenantId}/videos/<filename>`.
- Backend `mediaService` and related services always store `tenantId` on created rows and filter queries by `tenantId`.

## Routes and Middleware

- Routes set up in `config/routes.js` use global tenant middleware; `requireAuth` is applied on admin routes where appropriate (e.g., `POST /api/updateTheme`).
- Utility route `/api/whoami` returns `{ tenantId: req.tenantId }` for debugging.

## Migrations and Operational Tasks

- Migrations (`db/prisma/migrations/*`) establish tenant columns, FKs, unique constraints, and indexes.
- Notable migrations:
  - `init_multitenant`: initial tables with `tenantId` columns and uniques (e.g., `NewsletterSubscriber (tenantId, email)`).
  - `enforce_singleton_per_tenant`: adds unique constraints on `tenantId` for singleton tables and `User`.
  - `add_session_model` and `add_session_tenant`: introduce `Session` and backfill/require `tenantId` on sessions.
- Provisioning scripts:
  - `scripts/create-tenant.js`: creates/upsserts a Tenant (uses `DEV_TENANT_ID` if set).
  - `scripts/seed-core-dev.js`: seeds `TenantDomain`, `ContactInfo`, and `Bio` for the dev tenant.

## Security Considerations

- Cross‑tenant access is prevented by:
  - Mandatory `req.tenantId` middleware.
  - Service‑level scoping via `withTenant` and explicit `where: { tenantId, ... }` clauses.
  - Unique constraints on `tenantId` to avoid accidental collisions.
- RLS is not enabled; if desired in the future, policies could use `current_setting('app.tenant_id', true)` with `set_config` to enforce DB‑level isolation.
- Rate limiting is global with IPv6‑aware keying; can be extended to include `tenantId` if per‑tenant quotas are required.

## Operational Notes and Gotchas

- Always call services with the `tenantId` from `req.tenantId`. Avoid reading tenant from untrusted client input.
- All database calls must run inside `withTenant`. Avoid direct `prisma` calls in services.
- For public endpoints (e.g., GET theme), tenant resolution still applies via domain/subdomain.
- Emails that depend on branding must pass `tenantId`; otherwise they throw with a clear error.
- Refresh token validations are tenant‑aware to avoid cross‑tenant token reuse.

## RLS Readiness (Planned)

- We will enable Postgres Row‑Level Security (RLS) as a defense‑in‑depth layer using our existing `set_config('app.tenant_id', ...)` from `withTenant`.
- Scope: Phase 1 targets tenant‑owned content tables only (`Theme`, `Bio`, `ContactInfo`, `Member`, `Show`, `Video`, `FeaturedVideo`, `FeaturedRelease`, `MediaImage`, `HomeImage`, `MerchConfig`, `ShowsSettings`, `SpotifyPlayer`, `NewsletterSubscriber`).
- Policy template (per table):
  - SELECT: `USING ("tenantId" = current_setting('app.tenant_id', true))`
  - INSERT: `WITH CHECK ("tenantId" = current_setting('app.tenant_id', true))`
  - UPDATE: `USING ... WITH CHECK ...` with the same condition
  - DELETE: `USING ("tenantId" = current_setting('app.tenant_id', true))`
- Exceptions and notes:
  - `Tenant`, `TenantDomain` remain without RLS initially to allow resolver lookups prior to GUC being set.
  - `User`, `Session` will be considered in Phase 2 after validation that all auth flows run under `withTenant`.
  - Global unique constraints remain global (intended).
- Scripts/Jobs: any tenant‑scoped writes have been updated to use `withTenant`; any remaining global reads are safe or will be revisited during Phase 2.

### Runtime roles for RLS

- App runtime must connect with a role that does NOT have `BYPASSRLS`.
- Keep the owner role for migrations/maintenance only.
- Use two URLs:
  - `DATABASE_URL` → app role (RLS enforced)
  - `OWNER_DATABASE_URL` → owner role (used only when running migrations)

## Future Enhancements (Optional)

- Adopt Postgres RLS using the existing `set_config('app.tenant_id', ...)` to enforce server‑side isolation.
- Add per‑tenant rate limiting keys and metrics.
- Introduce request IDs and per‑tenant structured logging fields to improve traceability.
- Expand `TenantDomain` to support staging domains and auto‑verification flows.
