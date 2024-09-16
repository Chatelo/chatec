import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { AffiliateDashboard } from "@/app/components/AffiliateDashboard";
import { ReferralLink } from "@/app/components/ReferralLink";
import { Notifications } from "@/app/components/Notifications";
import { Affiliate } from "@/app/types";

export default async function AffiliateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      affiliate: {
        include: {
          referrals: true,
          commissions: {
            include: {
              affiliate: true,
            },
          },
          referralClicks: true,
        },
      },
      notifications: true,
    },
  });

  if (!user?.affiliate) {
    redirect("/affiliate/register");
  }

  // Calculate totalCommissions
  const totalCommissions = user.affiliate.commissions.reduce(
    (total, commission) => total + commission.amount,
    0
  );

  // Pass totalCommissions as part of affiliate data
  const affiliateData: Affiliate = {
    ...user.affiliate,
    totalCommissions,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
      <Notifications notifications={user.notifications} />
      <AffiliateDashboard affiliate={affiliateData} />
      <ReferralLink referralLink={user.affiliate.referralLink} />
    </div>
  );
}
