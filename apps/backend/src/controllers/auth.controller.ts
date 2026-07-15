import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const hashPassword = (password?: string) => password ? crypto.createHash("sha256").update(password).digest("hex") : undefined;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, googleId, password, provider } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ error: "Email and auth identifier are required" });
    }

    const normalizedEmail = String(email).toLowerCase();
    const passwordHash = hashPassword(password);

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email: normalizedEmail }] },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          passwordHash: passwordHash || user.passwordHash,
          authProvider: provider || user.authProvider,
        },
      });
      return res.status(200).json(user);
    }

    user = await prisma.user.create({
      data: {
        googleId,
        email: normalizedEmail,
        name: name || null,
        passwordHash,
        authProvider: provider || "google",
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};
