/*
  Warnings:

  - You are about to drop the column `serviceStatus` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[engineNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "serviceStatus",
ADD COLUMN     "lastEngineOilDate" TIMESTAMP(3),
ADD COLUMN     "lastTransmissionOilDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_engineNumber_key" ON "Vehicle"("engineNumber");
