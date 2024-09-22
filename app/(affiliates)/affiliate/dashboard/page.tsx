import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { AffiliateDashboard } from "@/app/components/AffiliateDashboard";
import { ReferralLink } from "@/app/components/ReferralLink";
import { Notifications } from "@/app/components/Notifications";
import {
  Affiliate,
  Commission,
  ReferralClick,
  User,
  Referral,
} from "@/app/types";

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
          referrals: {
            include: {
              referredUser: true,
            },
          },
          commissions: true,
          referralClicks: true,
          user: true,
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

  // Map User data
  const mapUser = (userData: User): User => ({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    isAdmin: userData.isAdmin,
    password: userData.password,
    digitalAgreements: [],
    posts: [],
    affiliate: null,
    referredBy: null,
    agreementLinks: [],
    notifications: [],
  });

  // Map Referral data
  const mapReferral = (referral: any): Referral => ({
    id: referral.id,
    affiliateId: referral.affiliateId,
    referredUserId: referral.referredUserId,
    status: referral.status,
    createdAt: referral.createdAt,
    completedAt: referral.completedAt,
    referredUser: referral.referredUser
      ? mapUser(referral.referredUser)
      : undefined,
  });

  // Forward declare mapAffiliate
  let mapAffiliate: (affiliateData: any) => Affiliate;

  const mapCommission = (commission: any, affiliateData: any): Commission => ({
    id: commission.id,
    affiliateId: commission.affiliateId,
    amount: commission.amount,
    status: commission.status,
    createdAt: commission.createdAt,
    get affiliate() {
      return mapAffiliate(affiliateData);
    },
  });

  const mapReferralClick = (click: any, affiliateData: any): ReferralClick => ({
    id: click.id,
    affiliateId: click.affiliateId,
    clickedAt: click.clickedAt,
    get affiliate() {
      return mapAffiliate(affiliateData);
    },
  });

  mapAffiliate = (affiliateData: any): Affiliate => ({
    id: affiliateData.id,
    userId: affiliateData.userId,
    affiliateCode: affiliateData.affiliateCode,
    referralLink: affiliateData.referralLink,
    commissionRate: affiliateData.commissionRate,
    totalClicks: affiliateData.totalClicks,
    createdAt: affiliateData.createdAt,
    totalCommissions: totalCommissions,
    user: mapUser(affiliateData.user),
    referrals: affiliateData.referrals.map(mapReferral),
    commissions: affiliateData.commissions.map((commission: Commission) =>
      mapCommission(commission, affiliateData)
    ),
    referralClicks: affiliateData.referralClicks.map((click: ReferralClick) =>
      mapReferralClick(click, affiliateData)
    ),
  });

  // Map the user's affiliate data
  const affiliateData: Affiliate = mapAffiliate(user.affiliate);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
      <Notifications notifications={user.notifications} />
      <AffiliateDashboard affiliate={affiliateData} />
      <ReferralLink referralLink={affiliateData.referralLink} />
    </div>
  );
}
