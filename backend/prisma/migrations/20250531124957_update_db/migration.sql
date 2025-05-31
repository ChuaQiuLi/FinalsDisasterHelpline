/*
  Warnings:

  - You are about to drop the column `badge_image` on the `Badge` table. All the data in the column will be lost.
  - Added the required column `badge_image_filled` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badge_image_outline` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "badge_image",
ADD COLUMN     "badge_image_filled" TEXT NOT NULL,
ADD COLUMN     "badge_image_outline" TEXT NOT NULL;
