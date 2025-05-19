/*
  Warnings:

  - The primary key for the `UserChecklistStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserChecklistStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserChecklistStatus" DROP CONSTRAINT "UserChecklistStatus_pkey",
DROP COLUMN "id",
ADD COLUMN     "checklist_status_id" SERIAL NOT NULL,
ADD CONSTRAINT "UserChecklistStatus_pkey" PRIMARY KEY ("checklist_status_id");
