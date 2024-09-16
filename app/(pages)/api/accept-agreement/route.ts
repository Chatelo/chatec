import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agreementLinkId } = await request.json();

  try {
    const agreementLink = await prisma.agreementLink.findUnique({
      where: { id: agreementLinkId },
      include: { user: true },
    });

    if (
      !agreementLink ||
      !agreementLink.isValid ||
      new Date() > agreementLink.expiresAt
    ) {
      return NextResponse.json(
        { error: "Invalid or expired agreement link" },
        { status: 400 }
      );
    }

    if (agreementLink.user.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a new DigitalAgreement
    const agreement = await prisma.digitalAgreement.create({
      data: {
        userId: agreementLink.userId,
        agreementText: "Standard agreement text", // You might want to store this elsewhere
        signature: session.user.email, // Using email as signature for simplicity
      },
    });

    // Invalidate the agreement link
    await prisma.agreementLink.update({
      where: { id: agreementLinkId },
      data: { isValid: false },
    });

    return NextResponse.json({ success: true, agreementId: agreement.id });
  } catch (error) {
    console.error("Error accepting agreement:", error);
    return NextResponse.json(
      { error: "Failed to accept agreement" },
      { status: 500 }
    );
  }
}
