-- Migration: Add ShowSystem ENUM
-- This migration creates a ShowSystem enum and updates the ShowsSettings.showSystem column to use it

-- Step 1: Create the ShowSystem enum
CREATE TYPE "ShowSystem" AS ENUM ('CUSTOM', 'BANDSINTOWN');

-- Step 2: Normalize existing data from lowercase to SCREAMING_SNAKE_CASE
UPDATE "ShowsSettings" SET "showSystem" = 
  CASE 
    WHEN "showSystem" = 'custom' THEN 'CUSTOM'
    WHEN "showSystem" = 'bandsintown' THEN 'BANDSINTOWN'
    ELSE 'CUSTOM'
  END;

-- Step 3: Update the ShowsSettings table to use the enum
ALTER TABLE "ShowsSettings" ALTER COLUMN "showSystem" TYPE "ShowSystem" USING "showSystem"::"ShowSystem";
