import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { cookies } from "next/headers";

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
    // Find the affiliate with the given code
    const affiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode },
    });

    if (!affiliate) {
      // If no affiliate found, redirect to home page
      redirect("/");
    }

    // Process the referral
    await processReferral(affiliate);

    // Set a cookie to track the referral
    cookies().set("referral", affiliateCode, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Redirect to home page
    redirect("/");
  } catch (error) {
    console.error("Error processing referral:", error);
    redirect("/");
  }
}
