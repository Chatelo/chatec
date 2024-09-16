"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";

type Commission = {
  id: number;
  amount: number;
  status: string;
  createdAt: Date;
  affiliate: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  };
};

async function markCommissionAsPaid(commissionId: number) {
  const response = await fetch("/api/mark-commission-paid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commissionId }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark commission as paid");
  }

  return response.json();
}

export const CommissionPayout: React.FC<{ commissions: Commission[] }> = ({
  commissions,
}) => {
  const [paidCommissions, setPaidCommissions] = useState<number[]>([]);

  const handlePayCommission = async (commissionId: number) => {
    try {
      await markCommissionAsPaid(commissionId);
      setPaidCommissions([...paidCommissions, commissionId]);
    } catch (error) {
      console.error("Error paying commission:", error);
      alert("Failed to pay commission. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Commissions</h2>
      <ul>
        {commissions.map((commission) => (
          <li key={commission.id} className="mb-4 p-4 border rounded">
            <p>
              Affiliate: {commission.affiliate.user.name} (
              {commission.affiliate.user.email})
            </p>
            <p>Amount: Kshs. {commission.amount.toFixed(2)}</p>
            <p>Date: {commission.createdAt.toLocaleDateString()}</p>
            {commission.status === "PENDING" &&
            !paidCommissions.includes(commission.id) ? (
              <Button onClick={() => handlePayCommission(commission.id)}>
                Mark as Paid
              </Button>
            ) : (
              <span className="text-green-500 font-bold">PAID</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
