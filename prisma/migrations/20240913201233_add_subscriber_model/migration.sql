/*
  Warnings:

  - A unique constraint covering the columns `[referralLink]` on the table `Affiliate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referralLink` to the `Affiliate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Affiliate" ADD COLUMN     "referralLink" TEXT NOT NULL,
ADD COLUMN     "totalClicks" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DigitalAgreement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "agreementText" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DigitalAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralClick" (
    "id" SERIAL NOT NULL,
    "affiliateId" INTEGER NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_referralLink_key" ON "Affiliate"("referralLink");

-- AddForeignKey
ALTER TABLE "DigitalAgreement" ADD CONSTRAINT "DigitalAgreement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralClick" ADD CONSTRAINT "ReferralClick_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
