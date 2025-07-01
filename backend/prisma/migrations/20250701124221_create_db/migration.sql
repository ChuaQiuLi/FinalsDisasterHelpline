-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "country" TEXT,
    "expoPushToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "DisasterNotificationLog" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "notification_disaster_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisasterNotificationLog_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Disaster" (
    "disaster_id" SERIAL NOT NULL,
    "disaster_name" TEXT NOT NULL,

    CONSTRAINT "Disaster_pkey" PRIMARY KEY ("disaster_id")
);

-- CreateTable
CREATE TABLE "ChecklistTitle" (
    "title_id" SERIAL NOT NULL,
    "disaster_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ChecklistTitle_pkey" PRIMARY KEY ("title_id")
);

-- CreateTable
CREATE TABLE "Checklist" (
    "checklist_id" SERIAL NOT NULL,
    "disaster_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title_id" INTEGER NOT NULL,
    "checklist_item" TEXT NOT NULL,

    CONSTRAINT "Checklist_pkey" PRIMARY KEY ("checklist_id")
);

-- CreateTable
CREATE TABLE "ChecklistTemplate" (
    "template_id" SERIAL NOT NULL,
    "title_id" INTEGER NOT NULL,
    "checklist_item" TEXT NOT NULL,

    CONSTRAINT "ChecklistTemplate_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "UserChecklistStatus" (
    "checklist_status_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "template_id" INTEGER,
    "checklist_id" INTEGER,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserChecklistStatus_pkey" PRIMARY KEY ("checklist_status_id")
);

-- CreateTable
CREATE TABLE "Country" (
    "country_id" SERIAL NOT NULL,
    "country_name" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("country_id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "contact_id" SERIAL NOT NULL,
    "country_id" INTEGER NOT NULL,
    "police" TEXT NOT NULL,
    "fire" TEXT NOT NULL,
    "medical" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "safety_guidelines" TEXT NOT NULL,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quiz_id" SERIAL NOT NULL,
    "disaster_id" INTEGER NOT NULL,
    "quiz_title" TEXT NOT NULL,
    "quiz_description" TEXT NOT NULL,
    "difficulty_level" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "QuizQuestions" (
    "question_id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "QuizQuestions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "QuizAnswer" (
    "answer_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "answer_explanation" TEXT,

    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "QuizResults" (
    "result_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "QuizResults_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "badge_id" SERIAL NOT NULL,
    "badge_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge_image_filled" TEXT NOT NULL,
    "badge_image_outline" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "earned_from" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("badge_id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "user_badge_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("user_badge_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "DisasterNotificationLog_user_id_notification_disaster_id_key" ON "DisasterNotificationLog"("user_id", "notification_disaster_id");

-- CreateIndex
CREATE UNIQUE INDEX "Disaster_disaster_name_key" ON "Disaster"("disaster_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklistStatus_user_id_template_id_key" ON "UserChecklistStatus"("user_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklistStatus_user_id_checklist_id_key" ON "UserChecklistStatus"("user_id", "checklist_id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_country_name_key" ON "Country"("country_name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_country_code_key" ON "Country"("country_code");

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_country_id_police_fire_medical_key" ON "EmergencyContact"("country_id", "police", "fire", "medical");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_quiz_title_key" ON "Quiz"("quiz_title");

-- CreateIndex
CREATE UNIQUE INDEX "QuizResults_user_id_quiz_id_key" ON "QuizResults"("user_id", "quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_badge_name_key" ON "Badge"("badge_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_user_id_badge_id_key" ON "UserBadge"("user_id", "badge_id");

-- AddForeignKey
ALTER TABLE "DisasterNotificationLog" ADD CONSTRAINT "DisasterNotificationLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistTitle" ADD CONSTRAINT "ChecklistTitle_disaster_id_fkey" FOREIGN KEY ("disaster_id") REFERENCES "Disaster"("disaster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_disaster_id_fkey" FOREIGN KEY ("disaster_id") REFERENCES "Disaster"("disaster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "ChecklistTitle"("title_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistTemplate" ADD CONSTRAINT "ChecklistTemplate_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "ChecklistTitle"("title_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "ChecklistTemplate"("template_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "Checklist"("checklist_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country"("country_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_disaster_id_fkey" FOREIGN KEY ("disaster_id") REFERENCES "Disaster"("disaster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestions" ADD CONSTRAINT "QuizQuestions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "QuizQuestions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResults" ADD CONSTRAINT "QuizResults_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResults" ADD CONSTRAINT "QuizResults_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("quiz_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "Badge"("badge_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
