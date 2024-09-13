import { NextResponse } from "next/server";
import { addSubscriber } from "@/app/lib/newsletter";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const message = await addSubscriber(email);
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "An error occurred while subscribing" },
      { status: 500 }
    );
  }
}
