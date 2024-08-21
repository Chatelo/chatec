"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]";
import prisma from "./prisma";

export async function getPosts(
  page: number = 1,
  limit: number = 10,
  query?: string
): Promise<Post[]> {
  const skip = (page - 1) * limit;
  let posts = await prisma.post.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  if (query) {
    posts = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    createdAt: post.createdAt.toISOString(),
    author: {
      name: post.author.name ?? "",
    },
  }));
}

export async function getPost(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });
  return post;
}

export async function createPost(data: {
  title: string;
  content: string;
  slug: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      slug: data.slug,
      authorId: session.user.id,
    },
  });
  return post;
}

export async function updatePost(
  id: number,
  data: {
    title: string;
    content: string;
    slug: string;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (post?.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      slug: data.slug,
    },
  });
  return updatedPost;
}

export async function deletePost(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (post?.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id },
  });
}
