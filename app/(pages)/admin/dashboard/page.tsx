import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  const affiliates = await prisma.affiliate.findMany({
    include: {
      user: true,
      referrals: true,
      commissions: true,
    },
  });

  const agreements = await prisma.digitalAgreement.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-skin-fill text-skin-base shadow rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Affiliates</h2>
        <ul>
          {affiliates.map((affiliate) => (
            <li key={affiliate.id} className="mb-2">
              {affiliate.user.name} - Code: {affiliate.affiliateCode} -
              Referrals: {affiliate.referrals.length}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-skin-fill text-skin-base shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Submitted Agreements</h2>
        <ul>
          {agreements.map((agreement) => (
            <li key={agreement.id} className="mb-2">
              {agreement.user.name} - Submitted on:{" "}
              {agreement.createdAt.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
