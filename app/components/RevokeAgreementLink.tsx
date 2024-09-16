"use client";

import React from "react";
import { revokeAgreementLink } from "@/app/lib/actions";
import { Button } from "@/app/components/ui/button";

interface RevokeAgreementLinkProps {
  linkId: number;
}

export const RevokeAgreementLink: React.FC<RevokeAgreementLinkProps> = ({
  linkId,
}) => {
  const handleRevoke = async () => {
    try {
      await revokeAgreementLink(linkId);
      alert("Agreement link revoked successfully");
    } catch (error) {
      console.error("Error revoking agreement link:", error);
      alert("Failed to revoke agreement link");
    }
  };

  return (
    <Button onClick={handleRevoke} variant="danger">
      Revoke
    </Button>
  );
};
