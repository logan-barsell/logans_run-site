-- Backfill-aware migration for Session.tenantId
-- 1) Add nullable column first
ALTER TABLE "public"."Session" ADD COLUMN "tenantId" TEXT;

-- 2) Backfill tenantId from User table via userId
UPDATE "public"."Session" s
SET "tenantId" = u."tenantId"
FROM "public"."User" u
WHERE s."userId" = u."id" AND s."tenantId" IS NULL;

-- 3) Enforce NOT NULL now that data is backfilled
ALTER TABLE "public"."Session" ALTER COLUMN "tenantId" SET NOT NULL;

-- 4) Add adminPhone to User if not already present (idempotent check omitted by Prisma)
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "adminPhone" TEXT;

-- 5) Create index
CREATE INDEX IF NOT EXISTS "Session_tenantId_userId_isActive_idx" ON "public"."Session"("tenantId", "userId", "isActive");

-- 6) Add FK
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
