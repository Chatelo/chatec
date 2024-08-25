import { Prisma } from "@prisma/client";

export const { QueryMode } = Prisma;

export type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  authorId: number;
  createdAt: string | Date; // Allow both string and Date
  updatedAt: string | Date; // Allow both string and Date
  author: {
    id: number;
    name: string | null; // Updated to allow null
    email: string;
    isAdmin: boolean;
    password: string;
  };
};

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};
