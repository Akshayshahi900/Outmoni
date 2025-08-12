import {Request , Response , NextFunction} from "express";

import jwt from "jsonwebtoken"

import {User} from "@prisma/client"

export const authMiddleware = (req:Request , res:Response , next:NextFunction)=>{
  try{
    const authHeader = req.header("authorization");
    if(!authHeader){
        return res.status(401).json({error:"UNAUTHORIZED"});
    }
    const token =authHeader.split(" ")[1]; // "Bearer <token>"
    if(!token){
        return res.status(401).json({error:"invalid token format"});
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET!) as User & {id:string};

    //attach the user to the request object
    // req.user = decoded;
    console.log("Authenticated user:", req.user);
    next();

  }catch(error){
    console.error("Auth error ", error);
    return res.status(401).json({error:"UNAUTHORIZED"});
  }
}