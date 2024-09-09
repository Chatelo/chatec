import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt-nodejs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and is an admin
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { email, name, password } = await request.json();

  if (!email || !name || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hashSync(password, "10");
    const newAdmin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating admin user" },
      { status: 500 }
    );
  }
}
