/*
  Warnings:

  - You are about to drop the column `phone_number` on the `EmergencyContact` table. All the data in the column will be lost.
  - You are about to drop the column `service_type` on the `EmergencyContact` table. All the data in the column will be lost.
  - Added the required column `fire` to the `EmergencyContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical` to the `EmergencyContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `police` to the `EmergencyContact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmergencyContact" DROP COLUMN "phone_number",
DROP COLUMN "service_type",
ADD COLUMN     "fire" TEXT NOT NULL,
ADD COLUMN     "medical" TEXT NOT NULL,
ADD COLUMN     "police" TEXT NOT NULL;
