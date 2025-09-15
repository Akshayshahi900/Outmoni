import jwt from "jsonwebtoken";

export async function createJWT(token: any) {
  // console.log("Creating JWT with token:", token);
  return jwt.sign(token, process.env.NEXTAUTH_SECRET!);
}
