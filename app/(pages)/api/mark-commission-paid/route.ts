import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { sendNotification } from "@/app/lib/email";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { commissionId } = await request.json();

  try {
    const commission = await prisma.commission.update({
      where: { id: commissionId },
      data: { status: "PAID" },
      include: { affiliate: { include: { user: true } } },
    });

    // Send notification to the affiliate
    await sendNotification(
      commission.affiliate.user.email,
      "Commission Paid",
      `Your commission of Kshs. ${commission.amount.toFixed(2)} has been paid.`
    );

    return NextResponse.json({ success: true, commission });
  } catch (error) {
    console.error("Error marking commission as paid:", error);
    return NextResponse.json(
      { error: "Failed to mark commission as paid" },
      { status: 500 }
    );
  }
}
