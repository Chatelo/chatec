import { NextResponse } from "next/server";
import { testEmailSending } from "@/app/lib/newsletter";

export async function GET() {
  try {
    await testEmailSending();
    return NextResponse.json(
      { message: "Test email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in test-email route:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
