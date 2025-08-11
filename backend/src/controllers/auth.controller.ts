import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Custom type if you've added `user` via middleware
interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    name?: string;
  };
}

// ✅ Called after frontend sends token, backend verifies it, and injects `req.user`
export const createUserIfNotExists = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(400).json({ message: "User info missing from request" });
    }
    const { email, name } = req.user;
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: name || null },
      })
    }
    res.status(200).json(user);
  }catch(error){
    next(error);
  }
};

// ✅ Optional: called manually via a POST body, e.g. for testing only
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;

    const user = await prisma.user.upsert({
      where: { email },
      update: {}, // Optionally update name, etc.
      create: { email, name },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
