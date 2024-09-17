import React from "react";
import TermsAndConditions from "@/app/components/TermsAndConditions";
import prisma from "@/app/lib/prisma";

export default async function TermsPage({
  params,
}: {
  params: { termsId: string };
}) {
  const { termsId } = params;

  // Fetch the agreement from the database
  const agreement = await prisma.digitalAgreement.findUnique({
    where: { termsId: termsId },
  });

  if (!agreement) {
    return <div>Terms not found</div>;
  }

  return <TermsAndConditions agreement={agreement} />;
}
