import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { AffiliateDashboard } from "@/app/components/AffiliateDashboard";
import { ReferralLink } from "@/app/components/ReferralLink";

export default async function AffiliateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return <div>Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      affiliate: {
        include: {
          referrals: true,
          commissions: true,
        },
      },
    },
  });

  if (!user?.affiliate) {
    return <div>You are not registered as an affiliate</div>;
  }

  // Calculate totalCommissions
  const totalCommissions = user.affiliate.commissions.reduce(
    (total, commission) => total + commission.amount,
    0
  );

  // Pass totalCommissions as part of affiliate data
  const affiliateData = {
    ...user.affiliate,
    totalCommissions,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
      <AffiliateDashboard affiliate={affiliateData} />
      <ReferralLink referralLink={user.affiliate.referralLink} />
    </div>
  );
}
