-- Migration: Add HeaderPosition ENUM
-- This migration creates a HeaderPosition enum and updates the Theme.headerPosition column to use it

-- Step 1: Create the HeaderPosition enum
CREATE TYPE "HeaderPosition" AS ENUM ('LEFT', 'CENTER', 'RIGHT');

-- Step 2: Normalize existing data from lowercase to SCREAMING_SNAKE_CASE
UPDATE "Theme" SET "headerPosition" = 
  CASE 
    WHEN "headerPosition" = 'left' THEN 'LEFT'
    WHEN "headerPosition" = 'center' THEN 'CENTER'
    WHEN "headerPosition" = 'right' THEN 'RIGHT'
    ELSE 'LEFT'
  END;

-- Step 3: Remove the default value temporarily
ALTER TABLE "Theme" ALTER COLUMN "headerPosition" DROP DEFAULT;

-- Step 4: Update the Theme table to use the enum
ALTER TABLE "Theme" ALTER COLUMN "headerPosition" TYPE "HeaderPosition" USING "headerPosition"::"HeaderPosition";

-- Step 5: Set the new default value
ALTER TABLE "Theme" ALTER COLUMN "headerPosition" SET DEFAULT 'LEFT';
