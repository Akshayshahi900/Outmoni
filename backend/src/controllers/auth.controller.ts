import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name },
      });
    }

    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    next(error);
  }

};


