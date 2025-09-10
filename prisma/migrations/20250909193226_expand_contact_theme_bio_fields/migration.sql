/*
  Warnings:

  - You are about to drop the column `bioJson` on the `Bio` table. All the data in the column will be lost.
  - You are about to drop the column `contactJson` on the `ContactInfo` table. All the data in the column will be lost.
  - You are about to drop the column `themeJson` on the `Theme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Bio" DROP COLUMN "bioJson",
ADD COLUMN     "customImageUrl" TEXT,
ADD COLUMN     "imageType" TEXT NOT NULL DEFAULT 'band-logo',
ADD COLUMN     "name" TEXT,
ADD COLUMN     "text" TEXT;

-- AlterTable
ALTER TABLE "public"."ContactInfo" DROP COLUMN "contactJson",
ADD COLUMN     "appleMusic" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "publicEmail" TEXT,
ADD COLUMN     "publicPhone" TEXT,
ADD COLUMN     "soundcloud" TEXT,
ADD COLUMN     "spotify" TEXT,
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "x" TEXT,
ADD COLUMN     "youtube" TEXT;

-- AlterTable
ALTER TABLE "public"."Theme" DROP COLUMN "themeJson",
ADD COLUMN     "backgroundColor" TEXT DEFAULT 'black',
ADD COLUMN     "bandLogoUrl" TEXT,
ADD COLUMN     "enableNewsletter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "greeting" TEXT,
ADD COLUMN     "headerDisplay" TEXT DEFAULT 'band-name-and-logo',
ADD COLUMN     "headerPosition" TEXT DEFAULT 'left',
ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "notifyOnNewMusic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyOnNewShows" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyOnNewVideos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paceTheme" TEXT DEFAULT 'minimal',
ADD COLUMN     "primaryColor" TEXT DEFAULT '#000000',
ADD COLUMN     "primaryFont" TEXT DEFAULT 'Anton',
ADD COLUMN     "secondaryColor" TEXT DEFAULT '#000000',
ADD COLUMN     "secondaryFont" TEXT DEFAULT 'Oswald',
ADD COLUMN     "siteTitle" TEXT DEFAULT 'Logan''s Run',
ADD COLUMN     "socialMediaIconStyle" TEXT DEFAULT 'default';
