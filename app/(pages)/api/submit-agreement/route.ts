// app/api/submit-agreement/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { sendAdminNotification } from "@/app/lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agreementText, signature, referralCode } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { referredBy: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (prisma) => {
      const agreement = await prisma.digitalAgreement.create({
        data: {
          userId: user.id,
          agreementText,
          signature,
        },
      });

      let referral = user.referredBy;
      if (!referral && referralCode) {
        const affiliate = await prisma.affiliate.findUnique({
          where: { affiliateCode: referralCode },
        });

        if (affiliate) {
          referral = await prisma.referral.create({
            data: {
              affiliateId: affiliate.id,
              referredUserId: user.id,
              status: "COMPLETED", // Since the user is submitting an agreement, we can consider the referral completed
            },
          });
        }
      }

      return { agreement, referral };
    });

    // Send email notification to admins
    await sendAdminNotification(
      "New Digital Agreement Submitted",
      `A new digital agreement has been submitted by ${user.name} (${
        user.email
      }).
      ${
        result.referral
          ? `Referred by affiliate code: ${referralCode}`
          : "No referral"
      }`
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error submitting agreement:", error);
    return NextResponse.json(
      { error: "Failed to submit agreement" },
      { status: 500 }
    );
  }
}
