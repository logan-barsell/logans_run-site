-- Migration: Add BioImageType ENUM
-- This migration creates a BioImageType enum and updates the Bio.imageType column to use it

-- Step 1: Create the BioImageType enum
CREATE TYPE "BioImageType" AS ENUM ('BAND_LOGO', 'HEADER_LOGO', 'CUSTOM_IMAGE');

-- Step 2: Normalize existing data from kebab-case to SCREAMING_SNAKE_CASE
UPDATE "Bio" SET "imageType" = 
  CASE 
    WHEN "imageType" = 'band-logo' THEN 'BAND_LOGO'
    WHEN "imageType" = 'header-logo' THEN 'HEADER_LOGO'
    WHEN "imageType" = 'custom-image' THEN 'CUSTOM_IMAGE'
    ELSE 'BAND_LOGO'
  END;

-- Step 3: Remove the default value temporarily
ALTER TABLE "Bio" ALTER COLUMN "imageType" DROP DEFAULT;

-- Step 4: Update the Bio table to use the enum
ALTER TABLE "Bio" ALTER COLUMN "imageType" TYPE "BioImageType" USING "imageType"::"BioImageType";

-- Step 5: Set the new default value
ALTER TABLE "Bio" ALTER COLUMN "imageType" SET DEFAULT 'BAND_LOGO';
