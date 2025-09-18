-- Migration: Add UserStatus ENUM
-- This migration creates a UserStatus enum and updates the User.status column to use it

-- Step 1: Create the UserStatus enum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- Step 2: Update the User table to use the enum
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus" USING "status"::"UserStatus";
