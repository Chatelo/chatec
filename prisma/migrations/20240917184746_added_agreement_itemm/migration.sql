-- DropIndex
DROP INDEX "DigitalAgreement_termsId_key";

-- AlterTable
ALTER TABLE "DigitalAgreement" ALTER COLUMN "termsId" SET DATA TYPE TEXT;
