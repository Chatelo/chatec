/*
  Warnings:

  - A unique constraint covering the columns `[termsId]` on the table `DigitalAgreement` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `termsId` on the `DigitalAgreement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DigitalAgreement" DROP COLUMN "termsId",
ADD COLUMN     "termsId" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DigitalAgreement_termsId_key" ON "DigitalAgreement"("termsId");
