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
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      redirect("/auth/signin");
    }

    const agreementLink = await prisma.agreementLink.findUnique({
      where: { link: params.link },
      include: { user: true },
    });

    if (!agreementLink) {
      return <ErrorMessage message="Agreement link not found." />;
    }

    if (!agreementLink.isValid) {
      return <ErrorMessage message="This agreement link is invalid." />;
    }

    if (new Date() > agreementLink.expiresAt) {
      return <ErrorMessage message="This agreement link has expired." />;
    }

    if (agreementLink.user.email !== session.user.email) {
      return (
        <ErrorMessage message="You are not authorized to view this agreement." />
      );
    }

    // Fetch the latest DigitalAgreement for this user
    const agreement = await prisma.digitalAgreement.findFirst({
      where: { userId: agreementLink.userId },
      orderBy: { createdAt: "desc" },
    });

    if (!agreement) {
      return <ErrorMessage message="Agreement not found." />;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Digital Agreement</h1>
        <AgreementForm
          agreementLinkId={agreementLink.id}
          agreement={agreement}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in AgreementPage:", error);
    return (
      <ErrorMessage message="An unexpected error occurred. Please try again later." />
    );
  }
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
}
