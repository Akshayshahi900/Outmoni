import { Request , Response ,NextFunction } from "express"; 
import jwt from "jsonwebtoken"

interface JWTPayload{
    id:string;
    email:string;
    name?: string;
}

declare global{
    namespace Express{
        interface Request{
            user?: JWTPayload;
        }
    }
}

export const verifyAuth = (req:Request , res:Response , next:NextFunction)=>{

    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer")){
        return res.status(401).json({error:"No token provided"});
    }
    const token = authHeader?.split(" ")[1];

    try{
        const decoded = jwt.verify(token , process.env.NEXTAUTH_SECRET!) as JWTPayload;
        req.user = decoded ;
        next();
    }catch(error){
        return res.status(401).json({error:"Invalid or expired token"});
    }
};