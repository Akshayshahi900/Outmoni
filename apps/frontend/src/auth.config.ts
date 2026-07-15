import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

async function registerWithBackend(user: { id?: string | null; email?: string | null; name?: string | null; password?: string | null }) {
  if (!user.email || !process.env.NEXT_PUBLIC_SERVER_URL) return;

  await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      googleId: user.id ?? `credentials:${user.email}`,
      email: user.email,
      name: user.name,
      password: user.password,
      provider: user.password ? "credentials" : "google",
    }),
  });
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password || password.length < 6) return null;

        await registerWithBackend({
          id: `credentials:${email}`,
          email,
          name: credentials?.name || email.split("@")[0],
          password,
        });

        return {
          id: `credentials:${email}`,
          email,
          name: credentials?.name || email.split("@")[0],
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await registerWithBackend(user);
        } catch (error) {
          console.error("Error registering Google user:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.googleId = user.id;
        token.userId = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.userId = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
