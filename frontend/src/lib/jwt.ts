import jwt from "jsonwebtoken";

export async function createJWT(token: any) {
  return jwt.sign(token, process.env.NEXTAUTH_SECRET!, { expiresIn: "24h" })
}
