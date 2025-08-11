import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { debug } from "console";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    // error: "/auth/error",     // 👈 optional
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      //when user logs in for the first time 
      console.log("JWT callback", token, user);

      if (user) {
        // token.accessToken = account.access_token;
        token.userId = user.id as string; // add id to the JWT
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },
    async session({ session, token }: any) {
      // add id to the session object for NEXT.js usage
      console.log("Session callback", session, token);
      if (session.user) {
        session.userId = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  

    //    async redirect() {
    //   return `/dashboard`;
    // }

  },
  debug:true,
  
  session: {
    strategy: "jwt"
  },
}

