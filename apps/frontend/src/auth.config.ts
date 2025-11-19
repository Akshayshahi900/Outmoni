import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { debug } from "console";
import { UserRoundIcon } from "lucide-react";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    // error: "/auth/error",     // 👈 optional
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {


      try {
        // console.log('NextAuth signIn - attempting to register user:', user);

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId: user.id,
            email: user.email,
            name: user.name
          })
        });

        const data = await response.json();
        // console.log('Registration response:', response.status, data);

        if (!response.ok) {
          console.error('Registration failed:', data);
        }

        return true;
      } catch (error) {
        console.error('Error registering user:', error);
        return true; // Don't block login
      }
    },
    async jwt({ token, user }) {
      //when user logs in for the first time 
      // console.log("JWT callback with token and user", token, user);

      if (user) {

        // token.accessToken = user.token;
        token.googleId = user.id;
        token.userId = user.id as string; // add id to the JWT
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },
    async session({ session, token }: any) {
      // add id to the session object for NEXT.js usage
      // console.log("Session callback", session, token);
      if (session.user) {
        session.userId = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.accessToken = token;
      }
      return session;
    },


    //    async redirect() {
    //   return `/dashboard`;
    // }

  },
  debug: true,
}

