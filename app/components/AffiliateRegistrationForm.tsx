"use client";

import React, { useState } from "react";
import { registerAffiliate } from "@/app/lib/actions";

export const AffiliateRegistrationForm = () => {
  const [commissionRate, setCommissionRate] = useState("10");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerAffiliate(parseFloat(commissionRate));
      if (result.success) {
        setMessage(
          `Affiliate registered successfully! Your affiliate code is: ${result.affiliateCode}`
        );
      } else {
        setMessage("Failed to register affiliate: " + result.error);
      }
    } catch (error) {
      console.error("Error registering affiliate:", error);
      setMessage("An error occurred while registering");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label
          htmlFor="commissionRate"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Commission Rate (%)
        </label>
        <input
          type="number"
          id="commissionRate"
          value={commissionRate}
          onChange={(e) => setCommissionRate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          readOnly={true}
          min="0"
          max="100"
          step="0.01"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Register as Affiliate
      </button>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </form>
  );
};
