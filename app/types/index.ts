import prisma from "../lib/prisma";

export const { QueryMode } = prisma;

export type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  authorId: number;
  views: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  author: {
    id: number;
    name: string | null;
    email: string;
    isAdmin: boolean;
    password?: string;
  };
};

export type SessionUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};
