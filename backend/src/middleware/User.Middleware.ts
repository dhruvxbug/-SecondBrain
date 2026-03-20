import type { JwtPayload } from "jsonwebtoken";
import {jwt, bcrypt} from "../config/config.js"
import type {Request, Response, NextFunction } from "express";
import { SessionModel } from "../models/Session.model.js";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function Authenticator(req: Request, res: Response, next: NextFunction){
    const token= req.headers.token; 
    
    if(!token || typeof token !== "string"){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_USER_SECRET as string) as JwtPayload;
        req.userId= decodedToken.id;
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


// refresh token endpoint logic - 
// creates a shortlived access token using refreshToken (long-lived) stored in safe HTTP-only cookie 
// while accessToken is less safe with only simple jwt logic 
// we rotate refreshToken for safety and invalidate the old hash by overwriting in session record 
//use an interceptor to watch for 401 Unauthorized request so that we can call this function automatically (for smooth user experience)
// we will set revoked to false when we log out 

export async function refreshToken(req: Request, res: Response , next: NextFunction){
    try{
        //refresh token 
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken || typeof refreshToken !== "string"){
        return res.status(401).json({
            message: "refresh token not found"
        })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_USER_SECRET as string) as JwtPayload;
    const Session = await SessionModel.findOne({
        UserId: decoded.id,
        revoked: false
    })

    if(!Session){
        return res.json({
            message: "wrong refresh Token"
        })
    }
    const refreshTokenCheck = await bcrypt.compare(refreshToken, Session.refreshTokenHash);
    if(!refreshTokenCheck){
        return res.json({
            message: "Wrong refresh token"
        })
    }
    
    const accessToken = jwt.sign({
        id: decoded.id
    }, process.env.JWT_USER_SECRET as string,{ expiresIn: '15m'});

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, process.env.JWT_USER_SECRET as string, {expiresIn: "7d"});

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken,5);
    Session.refreshTokenHash = newRefreshTokenHash;
    await Session.save();

    res.cookie("refreshToken", newRefreshToken,{
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "Access token refreshed successfully",
        accessToken
    })
    } catch(e){
        if(e instanceof Error){
            return res.status(500).json({
                message: "Error",
                error: e.message
            }) 
        } else{
            return res.status(500).json({
                message: "Error",
                error: String(e)
            })
        }
    }
}


// instead of refreshToken we could use userId directly to findOne and update 
// but for userId the func has to see auth function first and then redirect to logout 
// which may or may not happen 
export async function logout(req: Request, res: Response){
    try{
        const refreshToken = req.cookies.refreshToken;
        const userId = req.userId;
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_USER_SECRET as string) as JwtPayload;
    const Session = await SessionModel.findOne({
        UserId: decoded.id, // or directly use userId (as we had auth middleware )
        revoked: false
    })
    if(!Session){
        return res.json({
            message: "UnAuthorized request"
        })
    }
    const refreshTokenCheck = await bcrypt.compare(refreshToken, Session.refreshTokenHash);

    Session.revoked = true;
    await Session.save();

    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "Logged out successfully"
    })
    } catch(e){
        if(e instanceof Error){
            return res.status(500).json({
                message: "Error",
                error: e.message
            }) 
        } else{
            return res.status(500).json({
                message: "Error",
                error: String(e)
            })
        }
    }
}

export async function logoutAll(req: Request, res: Response){
     const userId = req.userId;

     await SessionModel.updateMany({
        user: userId,
        revoked: false 
     },{
        revoked: true
     })

     res.clearCookie("refreshToken")

     res.status(200).json({
        message: "Logged out of all devices successfully"
     })
}

