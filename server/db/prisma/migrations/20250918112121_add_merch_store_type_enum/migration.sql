-- Migration: Add MerchStoreType ENUM
-- This migration creates a MerchStoreType enum and updates the MerchConfig.storeType column to use it

-- Step 1: Create the MerchStoreType enum
CREATE TYPE "MerchStoreType" AS ENUM ('SHOPIFY', 'STRIPE', 'EXTERNAL');

-- Step 2: Normalize existing data from lowercase to SCREAMING_SNAKE_CASE
UPDATE "MerchConfig" SET "storeType" = 
  CASE 
    WHEN "storeType" = 'shopify' THEN 'SHOPIFY'
    WHEN "storeType" = 'stripe' THEN 'STRIPE'
    WHEN "storeType" = 'external' THEN 'EXTERNAL'
    ELSE 'SHOPIFY'
  END;

-- Step 3: Update the MerchConfig table to use the enum
ALTER TABLE "MerchConfig" ALTER COLUMN "storeType" TYPE "MerchStoreType" USING "storeType"::"MerchStoreType";
