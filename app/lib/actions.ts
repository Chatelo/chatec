"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]";
import prisma from "./prisma";

type Post = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
  };
};

// Update the session user type to include id
type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

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
  const user = session?.user as SessionUser;
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      slug: data.slug,
      authorId: parseInt(user.id),
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
  const user = session?.user as SessionUser;
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (post?.authorId !== undefined && post.authorId !== parseInt(user.id)) {
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
  const user = session?.user as SessionUser;
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (post?.authorId !== parseInt(user.id)) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id },
  });
}
