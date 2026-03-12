import type { JwtPayload } from "jsonwebtoken";
import {jwt} from "../config.js"
import type {Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

function UserMiddleware(req: Request, res: Response, next: NextFunction){
    const token= req.headers.token; 
    if(!token){
        res.json({
            message: "Auth Token not found."
        })
    }
    if(!token || typeof token !== "string"){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try{
        const checkToken = jwt.verify(token, process.env.JWT_USER_SECRET as string) as JwtPayload;
        req.userId= checkToken.id;
         next();
    } catch(e){
          if(e instanceof Error){
            res.status(500).json({
                error: e.message
            }) 
        } else{
            res.status(500).json({
                error: String(e)
            })
        }
    }
}

export {UserMiddleware}