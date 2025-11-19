import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JWTPayload {
    id: string;
    email: string;
    name?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
        // console.log("Decoded JWT payload:", decoded);

        // Find the user in database using Google ID to get MongoDB ObjectID
        const user = await prisma.user.findUnique({
            where: { 
                googleId: decoded.userId || decoded.sub 
            }
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Set req.user with the MongoDB ObjectID
        req.user = {
            id: user.id,  // ✅ This is now the MongoDB ObjectID
            email: user.email,
            name: user.name || undefined,
        };

        next();
    } catch (error) {
        console.error("Auth verification error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};