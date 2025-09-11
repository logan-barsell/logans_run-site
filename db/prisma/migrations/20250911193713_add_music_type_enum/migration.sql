/*
  Warnings:

  - Changed the type of `type` on the `FeaturedRelease` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."MusicType" AS ENUM ('SINGLE', 'ALBUM', 'EP', 'LP');

-- Add temporary column for data conversion
ALTER TABLE "public"."FeaturedRelease" ADD COLUMN "type_temp" "public"."MusicType";

-- Convert existing string values to enum values
UPDATE "public"."FeaturedRelease" SET "type_temp" = 
  CASE 
    WHEN "type" = 'single' THEN 'SINGLE'::"public"."MusicType"
    WHEN "type" = 'album' THEN 'ALBUM'::"public"."MusicType"
    WHEN "type" = 'EP' THEN 'EP'::"public"."MusicType"
    WHEN "type" = 'LP' THEN 'LP'::"public"."MusicType"
    ELSE 'ALBUM'::"public"."MusicType"  -- Default fallback
  END;

-- Drop old column and rename temp column
ALTER TABLE "public"."FeaturedRelease" DROP COLUMN "type";
ALTER TABLE "public"."FeaturedRelease" RENAME COLUMN "type_temp" TO "type";
ALTER TABLE "public"."FeaturedRelease" ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."SpotifyPlayer" ADD COLUMN     "type" "public"."MusicType";
