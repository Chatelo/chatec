import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { AgreementForm } from "@/app/components/AgreementForm";

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

    // Fetch the latest DigitalAgreement for this user
    const agreement = await prisma.digitalAgreement.findFirst({
      where: { userId: agreementLink.userId },
      orderBy: { createdAt: "desc" },
    });

    if (!agreement) {
      throw new AppError("Agreement not found.", 404);
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
    if (error instanceof AppError) {
      return (
        <ErrorMessage message={error.message} statusCode={error.statusCode} />
      );
    } else if (error instanceof Error) {
      return (
        <ErrorMessage
          message={`An unexpected error occurred: ${error.message}`}
          statusCode={500}
        />
      );
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
    <div className="container mx-auto px-4 py-8">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error {statusCode}: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
}
