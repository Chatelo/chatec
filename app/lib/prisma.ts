import PrismaClient from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient.PrismaClient().$extends(
  withAccelerate()
);

export default prisma;
