import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const ITERATIONS = 120_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

const normalizeEmail = (email: unknown) => String(email || "").trim().toLowerCase();

const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${ITERATIONS}:${salt}:${hash}`;
};

const verifyPassword = (password: string, stored?: string | null) => {
  if (!stored) return false;
  const [iterationsValue, salt, originalHash] = stored.split(":");
  if (!iterationsValue || !salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, Number(iterationsValue), KEY_LENGTH, DIGEST).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, googleId, password, provider } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !googleId) {
      return res.status(400).json({ error: "Email and auth identifier are required" });
    }

    const passwordHash = password ? hashPassword(String(password)) : undefined;
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ googleId }, { email }] } });

    if (existingUser) {
      const user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: name || existingUser.name,
          passwordHash: passwordHash || existingUser.passwordHash,
          authProvider: provider || existingUser.authProvider,
        },
      });
      return res.status(200).json({ id: user.id, email: user.email, name: user.name });
    }

    const user = await prisma.user.create({
      data: {
        googleId,
        email,
        name: name || null,
        passwordHash,
        authProvider: provider || "google",
      },
    });

    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || password.length < 6) {
      return res.status(400).json({ error: "Valid email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ error: "Failed to login user" });
  }
};
