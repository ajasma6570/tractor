/*
  Warnings:

  - A unique constraint covering the columns `[engineNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineNumber` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warrantyStatus` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WarrantyStatus" AS ENUM ('in_warranty', 'out_of_warranty');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "engineNumber" TEXT NOT NULL,
ADD COLUMN     "hmr" INTEGER,
ADD COLUMN     "warrantyStatus" "WarrantyStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_engineNumber_key" ON "Vehicle"("engineNumber");
