import type {NextFunction, Request, Response} from "express";
import {jwt, bcrypt, z} from "../config/config.js";
import {UserModel} from "../models/User.model.js"
import { TagModel, ContentModel, LinkModel } from "../models/Content.model.js";
import "dotenv/config"
import mongoose from "mongoose";
import {random, generateOTP, getOTPhtml} from "../util/util.js"
import { OTPmodel } from "../models/OTP.model.js";
import  { sendEmail } from "../services/Email.service.js";
import { SessionModel } from "../models/Session.model.js";

export async function signup(req: Request,res: Response, next: NextFunction){
     try{
            // zod object schema and .safeParse for zod 
            const requiredBody  = z.object ({
            username: z.string().min(3).trim().max(10),
            password: z.string().trim().min(8,"Password must be at least 8 characters").max(20, "Password can't exceed 20 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,"Password must contain at least one letter and one number and one special character"),
            email: z.email("Invalid email format").trim(),
            firstName: z.string().trim().min(3),
            lastName: z.string().trim().min(3),
            avatar: z.string().trim().optional(),
            bio: z.string().trim().optional(),
            github: z.string().optional(),
            linkedin: z.string().optional()
        })
        const parsedData = requiredBody.safeParse(req.body);
    
        if(!parsedData.success){
            return res.status(411).json({
                message: "Invalid Format",
                error: parsedData.error
            })
        }
    
        //imports and password hash
        const {username, email, password, firstName, lastName, avatar, bio, github, linkedin} = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);
    
        //checking if user already exists
        const isAlreadyRegistered = await UserModel.findOne({
            $or: [
                {UserName: username},
                {Email: email}
            ]
        })
        if(isAlreadyRegistered){
            return res.status(403).json({
                message: "User already exists"
            })
        }
    
        // create user
        const user = await UserModel.create({
           UserName: username,
           HashedPassword: hashedPassword,
           Email: email,
           Profile: {
            FirstName: firstName,
            LastName: lastName,
            Avatar: avatar,
            bio: bio,
            Socials: {
                Github: github,
                LinkedIn: linkedin
            }
           }
        })
    
        const otp = generateOTP();
        const html = getOTPhtml(otp);

        const otpHash = await bcrypt.hash(otp, 5);
        await OTPmodel.create({
            email,
            UserId: user._id,
            otpHash
        })

        await (sendEmail as unknown as (to: string, subject: string, text: string, html: string) => Promise<void>)(email, "OTP verification", `Your OTP code is ${otp}` , html);
    
        res.status(200).json({
            message: "User Created",
            user: {
                username: user.UserName,
                email: user.Email,
                verified: user.verified
            }
        })
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

export async function sendOtpAgain(req:Request, res:Response, next: NextFunction){
    try{
        const {email} = req.body;

        if(!email){
            return res.json({
                message: "Email not found"
            })
        }

        const user = await UserModel.findOne({
            Email : email
        })

        if(!user){
            return res.json({
                message: "User not found"
            })
        }
    
        const otp = generateOTP();
        const html = getOTPhtml(otp);

         const otpHash = await bcrypt.hash(otp, 5);
        await OTPmodel.create({
            email,
            UserId: user._id,
            otpHash
        })

        await (sendEmail as unknown as (to: string, subject: string, text: string, html: string) => Promise<void>)(email, "OTP verification", `Your OTP code is ${otp}` , html);
        
         res.status(200).json({
            message: "OTP sent"
        })

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

export async function verifyEmail(req: Request, res: Response, next: NextFunction){
    try{
        const {OTP,username,email} = req.body;
        const otpDetails = await OTPmodel.findOne({
            email 
        })
        if(!otpDetails){
            return res.status(400).json({
                message: "Invalid User Details"
            })
        }
        const otpVerify = await bcrypt.compare(OTP, otpDetails.otpHash);
        if(!otpVerify){
             return res.json({
                message: "wrong password"
            })
        } 

        const user = await UserModel.findByIdAndUpdate(otpDetails.UserId, {
            verified: true
          })
         await OTPmodel.deleteMany({
              UserId: otpDetails.UserId
          })

        return res.status(200).json({
            message: "Email verified",
            user: {
                username: user?.UserName,
                email: user?.Email,
                verified: user?.verified
            }
        })
    } catch(error){
        res.json({
            message: "error occured",
            error: error
        })
    }
}

export async function signin(req: Request,res: Response, next: NextFunction){
    try{
          const {username,password,email} = req.body;
          const IP = req.ip;
          const UserAgent = req.headers["user-agent"]

          if(!IP){
            return res.json({
                message: "No IP address found"
            })
          }
    
          //user check 
          const user = await UserModel.findOne({
            $or: [
                {UserName: username},
                {Email: email}
            ]
          });
          if(!user){
            return res.status(403).json({
                message: "User not found"
            })
          }
          if(!user.verified){
             return res.status(401).json({
                message: 'Email not verified'
             })
          }
    
          // password check 
          const passwordCheck = await bcrypt.compare(password, user.HashedPassword);

          if(!passwordCheck){
            return res.status(401).json({
                message: "Wrong password"
            })
          }
            // creating refreshToken jwt token then hashing it 
            const refreshToken = jwt.sign({id: user._id}, process.env.JWT_USER_SECRET as string, { expiresIn: '7d'});
            const refreshTokenHash = await bcrypt.hash(refreshToken, 5);

            // Adding refreshToken , IP ,User-Agent into the session Model
            const session = await SessionModel.create({
                UserId: new mongoose.Types.ObjectId(user._id),
                refreshTokenHash,
                ip: IP,
                userAgent: UserAgent as string
            })

            //creating a short lived access token dependant on sessionId (model)
            const accessToken = jwt.sign({ id: user._id, sessionId: session._id }, process.env.JWT_USER_SECRET as string, {expiresIn: '15m'}) 

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                message: "Logged in successfully",
                user: {
                    username: user.UserName,
                    email: user?.Email
                },
                accessToken
            })
         
        }catch(e){
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



// Auth flow (slightly complex)

// LOGIN
//  ├─ verify email + password
//  ├─ create session in DB
//  ├─ create refreshToken (7d)
//  ├─ create accessToken (15m)
//  └─ send both to client

// REQUEST API
//  ├─ client sends accessToken
//  └─ server verifies → returns data

// ACCESS TOKEN EXPIRES
//  ├─ client calls /refreshToken
//  ├─ server verifies refreshToken
//  ├─ checks session in DB
//  ├─ rotates refreshToken
//  └─ sends new accessToken