/*
  Warnings:

  - You are about to drop the `BioText` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenantId]` on the table `ContactInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `MerchConfig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `ShowsSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `Theme` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."BioText" DROP CONSTRAINT "BioText_tenantId_fkey";

-- DropIndex
DROP INDEX "public"."User_tenantId_adminEmail_key";

-- DropTable
DROP TABLE "public"."BioText";

-- CreateTable
CREATE TABLE "public"."Bio" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bioJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bio_tenantId_key" ON "public"."Bio"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_tenantId_key" ON "public"."ContactInfo"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "MerchConfig_tenantId_key" ON "public"."MerchConfig"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "ShowsSettings_tenantId_key" ON "public"."ShowsSettings"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_tenantId_key" ON "public"."Theme"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tenantId_key" ON "public"."User"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_adminEmail_key" ON "public"."User"("adminEmail");

-- AddForeignKey
ALTER TABLE "public"."Bio" ADD CONSTRAINT "Bio_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
