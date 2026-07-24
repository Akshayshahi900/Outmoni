import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL;

type BackendUser = { id: string; email: string; name?: string | null };

async function callAuthEndpoint(path: "register" | "login", payload: Record<string, unknown>) {
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is required for authentication");
  }

  const response = await fetch(`${backendUrl}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Authentication failed");
  }

  return data as BackendUser;
}

function toNextAuthUser(user: BackendUser): User {
  return { id: user.id, email: user.email, name: user.name || user.email.split("@")[0] };
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
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password || "";
        const mode = credentials?.mode === "register" ? "register" : "login";

        if (!email || password.length < 6) return null;

        const user = await callAuthEndpoint(mode, {
          googleId: `credentials:${email}`,
          email,
          password,
          name: credentials?.name || email.split("@")[0],
          provider: "credentials",
        });

        return toNextAuthUser(user);
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin", signOut: "/auth/signout" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      try {
        await callAuthEndpoint("register", {
          googleId: user.id,
          email: user.email,
          name: user.name,
          provider: "google",
        });
      } catch (error) {
        console.error("Error registering Google user:", error);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
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
