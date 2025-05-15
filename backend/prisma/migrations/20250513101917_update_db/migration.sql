/*
  Warnings:

  - You are about to drop the column `user_id` on the `EmergencyContact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmergencyContact" DROP CONSTRAINT "EmergencyContact_user_id_fkey";

-- AlterTable
ALTER TABLE "EmergencyContact" DROP COLUMN "user_id";
