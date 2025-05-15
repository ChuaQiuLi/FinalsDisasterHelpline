/*
  Warnings:

  - A unique constraint covering the columns `[country_id,police,fire,medical]` on the table `EmergencyContact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_country_id_police_fire_medical_key" ON "EmergencyContact"("country_id", "police", "fire", "medical");
