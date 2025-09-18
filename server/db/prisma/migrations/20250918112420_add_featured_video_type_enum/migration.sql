-- Migration: Add FeaturedVideoType ENUM
-- This migration creates a FeaturedVideoType enum and updates the FeaturedVideo.videoType column to use it

-- Step 1: Create the FeaturedVideoType enum
CREATE TYPE "FeaturedVideoType" AS ENUM ('YOUTUBE', 'UPLOAD');

-- Step 2: Normalize existing data from lowercase to SCREAMING_SNAKE_CASE
UPDATE "FeaturedVideo" SET "videoType" = 
  CASE 
    WHEN "videoType" = 'youtube' THEN 'YOUTUBE'
    WHEN "videoType" = 'upload' THEN 'UPLOAD'
    ELSE 'YOUTUBE'
  END;

-- Step 3: Update the FeaturedVideo table to use the enum
ALTER TABLE "FeaturedVideo" ALTER COLUMN "videoType" TYPE "FeaturedVideoType" USING "videoType"::"FeaturedVideoType";
