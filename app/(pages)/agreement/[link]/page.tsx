import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { AgreementForm } from "@/app/components/AgreementForm";
import TermsAndConditions from "@/app/components/TermsAndConditions";

class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = "AppError";
  }
}

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
      throw new AppError("Agreement link not found.", 404);
    }
    if (!agreementLink.isValid) {
      throw new AppError("This agreement link is invalid.", 400);
    }
    if (new Date() > agreementLink.expiresAt) {
      throw new AppError("This agreement link has expired.", 410);
    }
    if (agreementLink.user.email !== session.user.email) {
      throw new AppError("You are not authorized to view this agreement.", 403);
    }

    const agreementTemplate = {
      id: 0, // You might want to generate a proper ID here
      userId: agreementLink.userId,
      agreementText: `By signing this agreement, you agree to the Sigira Technologies Service Agreement.`,
      signature: "",
      agreedItems: [
        "I have read and understood the terms of service.",
        "I agree to abide by the company's policies.",
        "I understand that this agreement is legally binding.",
      ],
      termsId: "default-terms",
      createdAt: new Date(),
    };

    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Digital Agreement</h1>
        <TermsAndConditions agreement={agreementTemplate} />
        <AgreementForm
          agreementLinkId={agreementLink.id}
          agreement={agreementTemplate}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in AgreementPage:", error);
    if (error instanceof AppError) {
      return (
        <ErrorMessage message={error.message} statusCode={error.statusCode} />
      );
    } else if (error instanceof Error) {
      return <ErrorMessage message={error.message} statusCode={500} />;
    } else {
      return (
        <ErrorMessage message="An unknown error occurred." statusCode={500} />
      );
    }
  }
}

function ErrorMessage({
  message,
  statusCode,
}: {
  message: string;
  statusCode: number;
}) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-red-600">Error {statusCode}</h1>
      <p>{message}</p>
    </div>
  );
}
