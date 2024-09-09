import React from "react";
import { Card, CardHeader, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

type Affiliate = {
  id: number;
  userId: number;
  affiliateCode: string;
  commissionRate: number;
  createdAt: Date;
  totalClicks: number;
  totalCommissions: number;
  referrals: Array<{ id: number; status: string }>;
  commissions: Array<{ id: number; amount: number; status: string }>;
};

export const AffiliateDashboard: React.FC<{ affiliate: Affiliate }> = ({
  affiliate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>Affiliate Information</CardHeader>
        <CardContent>
          <p>Affiliate Code: {affiliate.affiliateCode}</p>
          <p>Commission Rate: {affiliate.commissionRate}%</p>
          <p>Joined: {affiliate.createdAt.toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Statistics</CardHeader>
        <CardContent>
          <p>Total Referrals: {affiliate.referrals.length}</p>
          <p>Total Clicks: {affiliate.totalClicks}</p>
          <p>
            Total Commissions: Kshs. {affiliate.totalCommissions.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>Recent Referrals</CardHeader>
        <CardContent>
          <ul>
            {affiliate.referrals.slice(0, 5).map((referral) => (
              <li key={referral.id} className="mb-2">
                Referral ID: {referral.id} -{" "}
                <Badge
                  variant={
                    referral.status === "COMPLETED" ? "success" : "warning"
                  }
                >
                  {referral.status}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
