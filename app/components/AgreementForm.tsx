"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

interface AgreementFormProps {
  agreementLink: {
    id: number;
    link: string;
    userId: number;
  };
}

export const AgreementForm: React.FC<AgreementFormProps> = ({
  agreementLink,
}) => {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the terms before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/accept-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agreementLinkId: agreementLink.id }),
      });

      if (response.ok) {
        alert("Agreement accepted successfully!");
        router.push("/dashboard");
      } else {
        throw new Error("Failed to accept agreement");
      }
    } catch (error) {
      console.error("Error accepting agreement:", error);
      alert("Failed to accept agreement. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Agreement Terms</h2>
        <p>[Insert your agreement terms here]</p>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="agree">I agree to the terms of this agreement</label>
      </div>
      <Button type="submit" disabled={!agreed}>
        Accept Agreement
      </Button>
    </form>
  );
};
