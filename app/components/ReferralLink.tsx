"use client";

import React, { useState } from "react";

interface ReferralLinkProps {
  referralLink: string;
}

export const ReferralLink: React.FC<ReferralLinkProps> = ({ referralLink }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-skin-fill text-skin-base shadow rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>
      <div className="flex items-center">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={copyToClipboard}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};
