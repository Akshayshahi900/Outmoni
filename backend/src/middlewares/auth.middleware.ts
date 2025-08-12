import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  email: string;
  name?: string;
  [key: string]: any;
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No Authorization Header" });
  }

  // const token = authHeader.split(' ')[1];
  const userId = authHeader.split (' ')[1]; // get the part after "bearer"

  if(!userId){
    return res.status(401).json({message:"Invalid authorization header"});
  }
  // attach to req for later
  (req as any).userId = userId;

  next();

  // try {
  //   const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as DecodedToken;
  //   (req as any).user = {
  //     email: decoded.email,
  //     name: decoded.name,
  //   };
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ error: 'Invalid token' });
  // }
};
