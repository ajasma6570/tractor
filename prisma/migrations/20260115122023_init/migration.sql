/*
  Warnings:

  - The primary key for the `CallRegister` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CallRegister` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ServiceRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ServiceRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `technicianId` column on the `ServiceRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ServiceSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ServiceSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `technicianId` column on the `ServiceSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Technician` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Technician` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `vehicleId` on the `CallRegister` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `CallRegister` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `calledById` on the `CallRegister` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicleId` on the `ServiceRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `ServiceRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicleId` on the `ServiceSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `ServiceSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CallRegister" DROP CONSTRAINT "CallRegister_calledById_fkey";

-- DropForeignKey
ALTER TABLE "CallRegister" DROP CONSTRAINT "CallRegister_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CallRegister" DROP CONSTRAINT "CallRegister_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_customerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceSchedule" DROP CONSTRAINT "ServiceSchedule_customerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceSchedule" DROP CONSTRAINT "ServiceSchedule_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceSchedule" DROP CONSTRAINT "ServiceSchedule_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_customerId_fkey";

-- AlterTable
ALTER TABLE "CallRegister" DROP CONSTRAINT "CallRegister_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "calledById",
ADD COLUMN     "calledById" INTEGER NOT NULL,
ADD CONSTRAINT "CallRegister_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "technicianId",
ADD COLUMN     "technicianId" INTEGER,
ADD CONSTRAINT "ServiceRecord_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ServiceSchedule" DROP CONSTRAINT "ServiceSchedule_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "technicianId",
ADD COLUMN     "technicianId" INTEGER,
ADD CONSTRAINT "ServiceSchedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Technician" DROP CONSTRAINT "Technician_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Technician_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSchedule" ADD CONSTRAINT "ServiceSchedule_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSchedule" ADD CONSTRAINT "ServiceSchedule_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSchedule" ADD CONSTRAINT "ServiceSchedule_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRegister" ADD CONSTRAINT "CallRegister_calledById_fkey" FOREIGN KEY ("calledById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRegister" ADD CONSTRAINT "CallRegister_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRegister" ADD CONSTRAINT "CallRegister_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
