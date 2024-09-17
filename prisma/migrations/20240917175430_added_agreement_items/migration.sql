/*
  Warnings:

  - Added the required column `termsId` to the `DigitalAgreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DigitalAgreement" ADD COLUMN     "termsId" TEXT NOT NULL;
