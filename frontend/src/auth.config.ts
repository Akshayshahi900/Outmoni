import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

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
    async jwt({token , user}){
        if(user){
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
        }
        return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
//    async redirect() {
//   return `/dashboard`;
// }

}
}

