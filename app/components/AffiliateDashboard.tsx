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
  referrals: Array<{ id: number; status: string; completedAt: Date | null }>;
  commissions: Array<{
    id: number;
    amount: number;
    status: string;
    createdAt: Date;
  }>;
};

export const AffiliateDashboard: React.FC<{ affiliate: Affiliate }> = ({
  affiliate,
}) => {
  const pendingCommissions = affiliate.commissions
    .filter((c) => c.status === "PENDING")
    .reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = affiliate.commissions
    .filter((c) => c.status === "PAID")
    .reduce((sum, c) => sum + c.amount, 0);

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
          <p>
            Completed Referrals:{" "}
            {affiliate.referrals.filter((r) => r.status === "COMPLETED").length}
          </p>
          <p>Total Clicks: {affiliate.totalClicks}</p>
          <p>Pending Commissions: Kshs. {pendingCommissions.toFixed(2)}</p>
          <p>Paid Commissions: Kshs. {paidCommissions.toFixed(2)}</p>
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
                {referral.completedAt &&
                  ` - Completed: ${referral.completedAt.toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>Recent Commissions</CardHeader>
        <CardContent>
          <ul>
            {affiliate.commissions.slice(0, 5).map((commission) => (
              <li key={commission.id} className="mb-2">
                Amount: Kshs. {commission.amount.toFixed(2)} -{" "}
                <Badge
                  variant={commission.status === "PAID" ? "success" : "warning"}
                >
                  {commission.status}
                </Badge>
                {` - Date: ${commission.createdAt.toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>Detailed Commission Report</CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Referral ID</th>
              </tr>
            </thead>
            <tbody>
              {affiliate.commissions.map((commission) => (
                <tr key={commission.id}>
                  <td>{commission.createdAt.toLocaleDateString()}</td>
                  <td>Kshs. {commission.amount.toFixed(2)}</td>
                  <td>{commission.status}</td>
                  {/* TODO : commented out because it doesnt exist in type, to fix */}
                  {/* <td>{commission.referralId}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
