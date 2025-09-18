-- Migration: Add HeaderDisplay ENUM
-- This migration creates a HeaderDisplay enum and updates the Theme.headerDisplay column to use it

-- Step 1: Create the HeaderDisplay enum
CREATE TYPE "HeaderDisplay" AS ENUM ('BAND_NAME_ONLY', 'BAND_NAME_AND_LOGO', 'LOGO_ONLY', 'HEADER_LOGO_ONLY');

-- Step 2: Normalize existing data from kebab-case to SCREAMING_SNAKE_CASE
UPDATE "Theme" SET "headerDisplay" = 
  CASE 
    WHEN "headerDisplay" = 'band-name-only' THEN 'BAND_NAME_ONLY'
    WHEN "headerDisplay" = 'band-name-and-logo' THEN 'BAND_NAME_AND_LOGO'
    WHEN "headerDisplay" = 'logo-only' THEN 'LOGO_ONLY'
    WHEN "headerDisplay" = 'header-logo-only' THEN 'HEADER_LOGO_ONLY'
    ELSE 'BAND_NAME_AND_LOGO'
  END;

-- Step 3: Remove the default value temporarily
ALTER TABLE "Theme" ALTER COLUMN "headerDisplay" DROP DEFAULT;

-- Step 4: Update the Theme table to use the enum
ALTER TABLE "Theme" ALTER COLUMN "headerDisplay" TYPE "HeaderDisplay" USING "headerDisplay"::"HeaderDisplay";

-- Step 5: Set the new default value
ALTER TABLE "Theme" ALTER COLUMN "headerDisplay" SET DEFAULT 'BAND_NAME_AND_LOGO';
