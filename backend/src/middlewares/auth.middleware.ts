import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  email: string;
  name?: string;
  [key: string]: any;
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No Authorization Header" });
  }

  const token = authHeader.split (' ')[1]; 

 try{
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    (req as any).user = decoded;
   next();
  }
catch(err){
  return res.status(401).json({error:"Invalid or expired token"});
}
};
