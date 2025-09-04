import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
  }
 
}
