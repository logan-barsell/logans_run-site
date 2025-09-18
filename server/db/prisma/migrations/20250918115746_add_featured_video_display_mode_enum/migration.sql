-- Migration: Add FeaturedVideoDisplayMode ENUM
-- This migration creates a FeaturedVideoDisplayMode enum and updates the FeaturedVideo.displayMode column to use it

-- Step 1: Create the FeaturedVideoDisplayMode enum
CREATE TYPE "FeaturedVideoDisplayMode" AS ENUM ('FULL', 'VIDEO_ONLY');

-- Step 2: Normalize existing data from mixed case to SCREAMING_SNAKE_CASE
UPDATE "FeaturedVideo" SET "displayMode" = 
  CASE 
    WHEN LOWER("displayMode") = 'full' THEN 'FULL'
    WHEN LOWER("displayMode") = 'videoonly' OR LOWER("displayMode") = 'video-only' THEN 'VIDEO_ONLY'
    ELSE 'FULL'
  END;

-- Step 3: Update the FeaturedVideo table to use the enum
ALTER TABLE "FeaturedVideo" ALTER COLUMN "displayMode" TYPE "FeaturedVideoDisplayMode" USING "displayMode"::"FeaturedVideoDisplayMode";
