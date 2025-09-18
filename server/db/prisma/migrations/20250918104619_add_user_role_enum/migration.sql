-- Migration: Add UserRole ENUM
-- This migration creates a UserRole enum and updates the User.role column to use it

-- Step 1: Create the UserRole enum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- Step 2: Normalize existing data to uppercase
UPDATE "User" SET "role" = UPPER("role") WHERE "role" != UPPER("role");

-- Step 3: Update the User table to use the enum
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";
