/*
  Warnings:

  - A unique constraint covering the columns `[user_id,quiz_id]` on the table `QuizResults` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuizResults_user_id_quiz_id_key" ON "QuizResults"("user_id", "quiz_id");
