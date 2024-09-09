import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import { sendAdminNotification } from "@/app/lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agreementText, signature } = await request.json();
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const agreement = await prisma.digitalAgreement.create({
      data: {
        userId: user.id,
        agreementText,
        signature,
      },
    });

    // Send email notification to admins
    await sendAdminNotification(
      "New Digital Agreement Submitted",
      `A new digital agreement has been submitted by ${user.name} (${user.email}).`
    );

    return NextResponse.json({ success: true, agreement });
  } catch (error) {
    console.error("Error submitting agreement:", error);
    return NextResponse.json(
      { error: "Failed to submit agreement" },
      { status: 500 }
    );
  }
}
