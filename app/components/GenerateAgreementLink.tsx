"use client";

import React, { useState } from "react";
import { generateAgreementLink } from "@/app/lib/actions";
import { Button } from "@/app/components/ui/button";

export const GenerateAgreementLink: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await generateAgreementLink(parseInt(userId));
      setGeneratedLink(result.link);
    } catch (error) {
      console.error("Error generating agreement link:", error);
      alert("Failed to generate agreement link");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
        required
      />
      <Button type="submit">Generate Link</Button>
      {generatedLink && <div>Generated Link: {generatedLink}</div>}
    </form>
  );
};
