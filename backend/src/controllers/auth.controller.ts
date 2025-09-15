import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    // console.log('Registration request body:', req.body);

    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await prisma.user.findUnique({
      where: { googleId }
    });

    if (user) {
      // console.log('User already registered:', user);
      return res.status(200).json(user);
    }

    user = await prisma.user.create({
      data: {
        googleId,
        email,
        name: name || null
      },
    });


    // console.log('Created new User:', user);  
    res.status(201).json(user);
  
  }
  catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }

};


