/*
  Warnings:

  - You are about to drop the column `lastEngineOilDate` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `lastTransmissionOilDate` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "lastEngineOilDate",
DROP COLUMN "lastTransmissionOilDate",
ADD COLUMN     "serviceStatus" "ServiceStatus" NOT NULL DEFAULT 'up_to_date';
