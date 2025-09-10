/*
  Warnings:

  - Added the required column `category` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."VideoCategory" AS ENUM ('LIVE_PERFORMANCE', 'VLOG', 'MUSIC_VIDEO', 'LYRIC_VIDEO');

-- First, add the new category column as nullable
ALTER TABLE "public"."Video" ADD COLUMN "category_new" "public"."VideoCategory";

-- Update existing videos with a default category (MUSIC_VIDEO)
UPDATE "public"."Video" SET "category_new" = 'MUSIC_VIDEO' WHERE "category_new" IS NULL;

-- Drop the old category column
ALTER TABLE "public"."Video" DROP COLUMN "category";

-- Rename the new column to category and make it NOT NULL
ALTER TABLE "public"."Video" RENAME COLUMN "category_new" TO "category";
ALTER TABLE "public"."Video" ALTER COLUMN "category" SET NOT NULL;
