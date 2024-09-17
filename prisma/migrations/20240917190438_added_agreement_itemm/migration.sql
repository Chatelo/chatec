/*
  Warnings:

  - A unique constraint covering the columns `[termsId]` on the table `DigitalAgreement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DigitalAgreement_termsId_key" ON "DigitalAgreement"("termsId");
