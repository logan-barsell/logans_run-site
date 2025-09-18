-- Migration: Simplify Tenant Domain Structure
-- This migration replaces the TenantDomain table with direct fields on the Tenant table
-- and removes the redundant slug field in favor of subDomain

-- Step 1: Add new columns to Tenant table
ALTER TABLE "Tenant" ADD COLUMN "subDomain" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "domain" TEXT;
ALTER TABLE "Tenant" ADD COLUMN "isCustomDomain" BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Migrate existing TenantDomain data to Tenant table
UPDATE "Tenant" SET
  "domain" = (
    SELECT "domain"
    FROM "TenantDomain"
    WHERE "TenantDomain"."tenantId" = "Tenant"."id"
    LIMIT 1
  ),
  "subDomain" = (
    SELECT CASE
      WHEN "domain" LIKE '%.bandsyte.com' THEN
        REPLACE("domain", '.bandsyte.com', '')
      ELSE NULL
    END
    FROM "TenantDomain"
    WHERE "TenantDomain"."tenantId" = "Tenant"."id"
    AND "TenantDomain"."domain" LIKE '%.bandsyte.com'
    LIMIT 1
  ),
  "isCustomDomain" = (
    SELECT CASE
      WHEN "domain" NOT LIKE '%.bandsyte.com' THEN true
      ELSE false
    END
    FROM "TenantDomain"
    WHERE "TenantDomain"."tenantId" = "Tenant"."id"
    LIMIT 1
  )
WHERE EXISTS (
  SELECT 1 FROM "TenantDomain"
  WHERE "TenantDomain"."tenantId" = "Tenant"."id"
);

-- Step 3: For tenants without TenantDomain records, use slug as subDomain
UPDATE "Tenant" SET
  "subDomain" = "slug",
  "domain" = "slug" || '.bandsyte.com',
  "isCustomDomain" = false
WHERE "subDomain" IS NULL;

-- Step 4: Add unique constraints
CREATE UNIQUE INDEX "Tenant_subDomain_key" ON "Tenant"("subDomain") WHERE "subDomain" IS NOT NULL;
CREATE UNIQUE INDEX "Tenant_domain_key" ON "Tenant"("domain") WHERE "domain" IS NOT NULL;

-- Step 5: Drop the old slug column and TenantDomain table
DROP INDEX "Tenant_slug_key";
ALTER TABLE "Tenant" DROP COLUMN "slug";
DROP TABLE "TenantDomain";
