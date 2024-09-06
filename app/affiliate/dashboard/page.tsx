import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { AffiliateDashboard } from "@/app/components/AffiliateDashboard";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Affiliate Dashboard</h1>
      <AffiliateDashboard affiliate={user.affiliate} />
    </div>
  );
}
