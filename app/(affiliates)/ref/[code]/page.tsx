import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session {
    referralCode?: string;
  }
}

async function processReferral(affiliate: any) {
  // Log the referral click
  await prisma.referralClick.create({
    data: {
      affiliateId: affiliate.id,
      clickedAt: new Date(),
    },
  });

  // Update affiliate statistics
  await prisma.affiliate.update({
    where: { id: affiliate.id },
    data: {
      totalClicks: { increment: 1 },
    },
  });
}

export default async function ReferralPage({
  params,
}: {
  params: { code: string };
}) {
  const affiliateCode = params.code;
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode },
      include: {
        referrals: true,
      },
    });

    if (!affiliate) {
      redirect("/");
    }

    await processReferral(affiliate);

    // Set a cookie to track the referral (90 days)
    cookies().set("referral", affiliateCode, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 90,
    });

    // Also store the referral in the session
    const session = await getServerSession(authOptions);
    if (session) {
      session.referralCode = affiliateCode;
      // No need to save the session as next-auth handles it automatically
    }

    redirect("/");
  } catch (error) {
    console.error("Error processing referral:", error);
    redirect("/");
  }
}
