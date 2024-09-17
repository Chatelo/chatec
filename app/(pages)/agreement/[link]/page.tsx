import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { AgreementForm } from "@/app/components/AgreementForm";

export default async function AgreementPage({
  params,
}: {
  params: { link: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/auth/signin");
  }

  const agreementLink = await prisma.agreementLink.findUnique({
    where: { link: params.link },
    include: { user: true },
  });

  if (
    !agreementLink ||
    !agreementLink.isValid ||
    new Date() > agreementLink.expiresAt
  ) {
    return <div>This agreement link is invalid or has expired.</div>;
  }

  if (agreementLink.user.email !== session.user.email) {
    return <div>You are not authorized to view this agreement.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Digital Agreement</h1>
      <AgreementForm agreementLinkId={agreementLink.id} />
    </div>
  );
}
