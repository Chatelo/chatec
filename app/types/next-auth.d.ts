import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface User {
    isAdmin?: boolean; // Extend the User interface
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
  interface JWT {
    isAdmin?: boolean; // Extend the JWT interface
  }
}
