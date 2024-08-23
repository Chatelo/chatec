"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/(pages)/api/auth/[...nextauth]/route";
import prisma from "./prisma";
import bcrypt from "bcrypt";

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

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

export async function getPosts(
  page: number = 1,
  limit: number = 10,
  query?: string
): Promise<{ posts: Post[]; totalPages: number }> {
  const skip = (page - 1) * limit;

  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      createdAt: post.createdAt.toISOString(),
      author: {
        name: post.author.name ?? "",
      },
    })),
    totalPages,
  };
}

export async function getCurrentUserPosts(
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; totalPages: number } | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;
  if (!user?.id) {
    return null;
  }

  return getPostsByAuthor(parseInt(user.id), page, limit);
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
    },
  });
  return post;
}

export async function getPostsByAuthor(
  authorId: number,
  page: number = 1,
  limit: number = 10
): Promise<{ posts: Post[]; totalPages: number }> {
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { authorId },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    }),
    prisma.post.count({ where: { authorId } }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      createdAt: post.createdAt.toISOString(),
      author: {
        name: post.author.name ?? "",
      },
    })),
    totalPages,
  };
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

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        authorId: parseInt(user.id),
      },
    });
    return post;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes(
          "Unique constraint failed on the fields: (`slug`)"
        )
      ) {
        throw new Error("A post with this slug already exists");
      }
    }
    throw error;
  }
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

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { id: user.id, name: user.name, email: user.email };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Failed to register user");
    }
  }
}
