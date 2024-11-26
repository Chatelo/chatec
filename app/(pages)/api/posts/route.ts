import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { SessionUser } from "@/app/types";

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;
  if (!user?.id || !user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const body = await request.json();
  const { title, content, slug, authorId } = body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      author: {
        connect: authorId,
      },
    },
  });

  return NextResponse.json(post);
}
