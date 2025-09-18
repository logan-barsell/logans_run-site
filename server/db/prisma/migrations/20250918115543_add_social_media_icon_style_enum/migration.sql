-- Migration: Add SocialMediaIconStyle ENUM
-- This migration creates a SocialMediaIconStyle enum and updates the Theme.socialMediaIconStyle column to use it

-- Step 1: Create the SocialMediaIconStyle enum
CREATE TYPE "SocialMediaIconStyle" AS ENUM ('DEFAULT', 'COLORFUL');

-- Step 2: Normalize existing data from lowercase to uppercase
UPDATE "Theme" SET "socialMediaIconStyle" = UPPER("socialMediaIconStyle") WHERE "socialMediaIconStyle" IS NOT NULL;

-- Step 3: Remove the default value temporarily
ALTER TABLE "Theme" ALTER COLUMN "socialMediaIconStyle" DROP DEFAULT;

-- Step 4: Update the Theme table to use the enum
ALTER TABLE "Theme" ALTER COLUMN "socialMediaIconStyle" TYPE "SocialMediaIconStyle" USING "socialMediaIconStyle"::"SocialMediaIconStyle";

-- Step 5: Set the new default value
ALTER TABLE "Theme" ALTER COLUMN "socialMediaIconStyle" SET DEFAULT 'DEFAULT';
