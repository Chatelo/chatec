"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "./prisma";
import bcrypt from "bcrypt";
import { Post, SessionUser, QueryMode } from "@/app/types";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { sendNotification } from "@/app/lib/email";
import { sendAgreementNotification } from "@/app/lib/email";

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
          { title: { contains: query, mode: QueryMode.insensitive } },
          { content: { contains: query, mode: QueryMode.insensitive } },
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
    posts: posts.map((post: Post) => ({
      ...post,
      content:
        typeof post.content === "string"
          ? JSON.parse(post.content)
          : post.content,
      createdAt: new Date(post.createdAt).toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name ?? "",
        email: post.author.email,
        isAdmin: post.author.isAdmin,
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
  if (!post) {
    return null;
  }

  return {
    ...post,
    content:
      typeof post.content === "string"
        ? JSON.parse(post.content)
        : post.content,
    createdAt: new Date(post.createdAt).toISOString(),
  };
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
    posts: posts.map((post: Post) => ({
      ...post,
      content:
        typeof post.content === "string"
          ? JSON.parse(post.content)
          : post.content,
      createdAt: new Date(post.createdAt).toISOString(),
      author: {
        id: post.author.id,
        name: post.author.name ?? "",
        email: post.author.email,
        isAdmin: post.author.isAdmin,
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

  if (post) {
    return {
      ...post,
      content:
        typeof post.content === "string"
          ? JSON.parse(post.content)
          : post.content,
      author: {
        id: post.author.id,
        name: post.author.name ?? "",
        email: post.author.email,
        isAdmin: post.author.isAdmin,
      },
    };
  }

  return null;
}

export async function createPost(data: {
  title: string;
  content: string | object;
  slug: string;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser;

  if (!user?.isAdmin) {
    throw new Error("Unauthorized");
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content:
          typeof data.content === "string"
            ? data.content
            : JSON.stringify(data.content),
        slug: data.slug,
        authorId: user.id
          ? parseInt(user.id)
          : (undefined as unknown as number),
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
    content: string | object;
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
      content:
        typeof data.content === "string"
          ? data.content
          : JSON.stringify(data.content), // This should already be stringified
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
  redirect("/blog");
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

export async function registerAffiliate(commissionRate: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return { success: false, error: "User not authenticated" };
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return { success: false, error: "User not found" };
    }
    const affiliateCode = uuidv4().substring(0, 8);
    const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL}/ref/${affiliateCode}`;
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        affiliateCode,
        commissionRate,
        referralLink,
      },
    });

    // Create a new referral click record
    await prisma.referralClick.create({
      data: {
        affiliateId: affiliate.id,
        clickedAt: new Date(),
      },
    });

    return {
      success: true,
      affiliateCode: affiliate.affiliateCode,
      referralLink: affiliate.referralLink,
    };
  } catch (error) {
    console.error("Error registering affiliate:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function completeReferral(referralId: number) {
  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
    include: {
      affiliate: {
        include: { user: true },
      },
    },
  });

  if (!referral) {
    throw new Error("Referral not found");
  }

  if (referral.status === "COMPLETED") {
    throw new Error("Referral already completed");
  }

  const updatedReferral = await prisma.referral.update({
    where: { id: referralId },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  const commissionAmount = calculateCommission(
    referral.affiliate.commissionRate
  );

  const commission = await prisma.commission.create({
    data: {
      affiliateId: referral.affiliateId,
      amount: commissionAmount,
      status: "PENDING",
      // referralId: referralId,
      //TODO Link commission to specific referral
    },
  });

  // Check if user email exists before sending notification
  if (referral.affiliate.user?.email) {
    await sendNotification(
      referral.affiliate.user.email,
      "New Commission",
      `You've earned a new commission of Kshs. ${commissionAmount.toFixed(2)}`
    );
  } else {
    console.error(
      `Unable to send notification: User email not found for referral ${referralId}`
    );
  }

  return { updatedReferral, commission };
}

export async function generateAgreementLink(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin?.isAdmin) {
    throw new Error("Unauthorized");
  }

  const link = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Link expires in 7 days

  const agreementLink = await prisma.agreementLink.create({
    data: {
      userId,
      link,
      expiresAt,
    },
    include: { user: true },
  });

  // Send notification to the user
  await sendAgreementNotification(agreementLink.user.email, link);

  return agreementLink;
}

export async function revokeAgreementLink(linkId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const admin = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!admin?.isAdmin) {
    throw new Error("Unauthorized");
  }

  const revokedLink = await prisma.agreementLink.update({
    where: { id: linkId },
    data: { isValid: false },
  });

  const user = await prisma.user.findUnique({
    where: { id: revokedLink.userId },
  });

  if (user) {
    await sendNotification(
      user.email,
      "Agreement Revoked",
      "Your agreement link has been revoked."
    );
  }

  return revokedLink;
}

export async function createNotification(userId: number, message: string) {
  return prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
}

function calculateCommission(commissionRate: number) {
  // Implement your commission calculation logic here
  return 100 * (commissionRate / 100); // Example: $100 * commission rate
}
