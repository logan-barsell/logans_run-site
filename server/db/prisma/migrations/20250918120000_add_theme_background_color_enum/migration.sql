-- Migration: Add ThemeBackgroundColor ENUM
-- This migration creates a ThemeBackgroundColor enum and updates the Theme.backgroundColor column to use it

-- Step 1: Create the ThemeBackgroundColor enum
CREATE TYPE "ThemeBackgroundColor" AS ENUM ('BLACK', 'PURPLE', 'RED', 'GREEN', 'TEAL', 'BLUE', 'BURGUNDY', 'GRAY', 'BROWN', 'PINK');

-- Step 2: Normalize existing data from lowercase to uppercase
UPDATE "Theme" SET "backgroundColor" = UPPER("backgroundColor") WHERE "backgroundColor" IS NOT NULL;

-- Step 3: Remove the default value temporarily
ALTER TABLE "Theme" ALTER COLUMN "backgroundColor" DROP DEFAULT;

-- Step 4: Update the Theme table to use the enum
ALTER TABLE "Theme" ALTER COLUMN "backgroundColor" TYPE "ThemeBackgroundColor" USING "backgroundColor"::"ThemeBackgroundColor";

-- Step 5: Set the new default value
ALTER TABLE "Theme" ALTER COLUMN "backgroundColor" SET DEFAULT 'BLACK';
