-- Migration: Remove Redundant Columns
-- This migration removes redundant columns to establish single source of truth
-- - Remove Tenant.name (band name should come from theme.siteTitle)
-- - Remove Bio.name (band name should come from theme.siteTitle)  
-- - Remove User.bandName (band name should come from theme.siteTitle)
-- - Remove User.userType (only need User.role)

-- Remove redundant columns
ALTER TABLE "Tenant" DROP COLUMN IF EXISTS "name";
ALTER TABLE "Bio" DROP COLUMN IF EXISTS "name";
ALTER TABLE "User" DROP COLUMN IF EXISTS "bandName";
ALTER TABLE "User" DROP COLUMN IF EXISTS "userType";
