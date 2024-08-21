import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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
