-- Migration: Add SpotifyBgColor ENUM
-- This migration creates a SpotifyBgColor enum and updates the SpotifyPlayer.bgColor column to use it

-- Step 1: Create the SpotifyBgColor enum
CREATE TYPE "SpotifyBgColor" AS ENUM ('AUTO', 'DARK', 'LIGHT');

-- Step 2: Normalize existing data from mixed string/numeric to ENUM values
UPDATE "SpotifyPlayer" SET "bgColor" = 
  CASE 
    WHEN "bgColor" = 'auto' THEN 'AUTO'
    WHEN "bgColor" = '0' THEN 'DARK'
    WHEN "bgColor" = '1' THEN 'LIGHT'
    ELSE 'AUTO'
  END;

-- Step 3: Update the SpotifyPlayer table to use the enum
ALTER TABLE "SpotifyPlayer" ALTER COLUMN "bgColor" TYPE "SpotifyBgColor" USING "bgColor"::"SpotifyBgColor";
