import { Prisma } from "@prisma/client";

export const { QueryMode } = Prisma;

export type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
  };
};

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};
