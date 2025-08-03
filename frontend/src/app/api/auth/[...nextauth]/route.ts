import NextAuth from "next-auth";
import { authConfig } from "@/auth.config"; // ✅ Adjust this if you use baseUrl path alias

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
