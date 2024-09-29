import PrismaClient from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

// export const prisma = new PrismaClient.PrismaClient().$extends(
//   withAccelerate()
// );

// TODO to enable accelerate, uncomment the following lines and fix "prisma" type error in the app

export const prisma = new PrismaClient.PrismaClient();
export default prisma;
