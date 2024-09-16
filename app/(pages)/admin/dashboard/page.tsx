import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { GenerateAgreementLink } from "@/app/components/GenerateAgreementLink";
import { RevokeAgreementLink } from "@/app/components/RevokeAgreementLink";

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
      referralClicks: true,
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

  const agreementLinks = await prisma.agreementLink.findMany({
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>Affiliates</CardHeader>
          <CardContent>
            <ul>
              {affiliates.map((affiliate) => (
                <li key={affiliate.id} className="mb-2">
                  {affiliate.user.name} - Code: {affiliate.affiliateCode} -
                  Referrals: {affiliate.referrals.length} - Clicks:{" "}
                  {affiliate.referralClicks.length} - Commissions: Kshs.{" "}
                  {affiliate.commissions
                    .reduce((sum, c) => sum + c.amount, 0)
                    .toFixed(2)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Submitted Agreements</CardHeader>
          <CardContent>
            <ul>
              {agreements.map((agreement) => (
                <li key={agreement.id} className="mb-2">
                  {agreement.user.name} - Submitted on:{" "}
                  {agreement.createdAt.toLocaleString()}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>Agreement Links</CardHeader>
          <CardContent>
            <ul>
              {agreementLinks.map((link) => (
                <li key={link.id} className="mb-2">
                  {link.user.name} - Link: {link.link} - Valid:
                  <Badge variant={link.isValid ? "success" : "danger"}>
                    {link.isValid ? "Valid" : "Invalid"}
                  </Badge>
                  <RevokeAgreementLink linkId={link.id} />
                </li>
              ))}
            </ul>
            <GenerateAgreementLink />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
