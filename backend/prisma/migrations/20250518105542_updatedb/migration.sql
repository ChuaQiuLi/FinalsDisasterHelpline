-- CreateTable
CREATE TABLE "UserChecklistStatus" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "template_id" INTEGER,
    "checklist_id" INTEGER,
    "is_checked" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserChecklistStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklistStatus_user_id_template_id_key" ON "UserChecklistStatus"("user_id", "template_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklistStatus_user_id_checklist_id_key" ON "UserChecklistStatus"("user_id", "checklist_id");

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "ChecklistTemplate"("template_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "Checklist"("checklist_id") ON DELETE SET NULL ON UPDATE CASCADE;
