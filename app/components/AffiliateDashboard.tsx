import React from "react";

// Define the Affiliate type based on the Prisma schema
type Affiliate = {
  id: number;
  userId: number;
  affiliateCode: string;
  commissionRate: number;
  createdAt: Date;
  referrals: Array<{
    id: number;
    status: string;
  }>;
  commissions: Array<{
    id: number;
    amount: number;
    status: string;
  }>;
};

export const AffiliateDashboard: React.FC<{ affiliate: Affiliate }> = ({
  affiliate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Affiliate Information</h2>
        <p>Affiliate Code: {affiliate.affiliateCode}</p>
        <p>Commission Rate: {affiliate.commissionRate}%</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Statistics</h2>
        <p>Total Referrals: {affiliate.referrals.length}</p>
        <p>
          Total Commissions: $
          {affiliate.commissions
            .reduce((sum, commission) => sum + commission.amount, 0)
            .toFixed(2)}
        </p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 col-span-full">
        <h2 className="text-lg font-semibold mb-2">Recent Referrals</h2>
        <ul>
          {affiliate.referrals.slice(0, 5).map((referral) => (
            <li key={referral.id} className="mb-2">
              Referral ID: {referral.id} - Status: {referral.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
