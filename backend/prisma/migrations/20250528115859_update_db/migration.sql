/*
  Warnings:

  - Added the required column `earned_from` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "earned_from" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizResults" ADD CONSTRAINT "QuizResults_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE;
