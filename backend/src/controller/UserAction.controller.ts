import type {Request, Response, NextFunction} from "express"
import { ContentModel } from "../models/Content.model.js";
import { LinkModel } from "../models/Content.model.js";
import { UserModel } from "../models/User.model.js";
import { random } from "../util/util.js";
import mongoose from "mongoose";

export async function postUserContent(req: Request,res: Response, next: NextFunction){
     try{
       const { title, link, type, tags } = req.body;
       const userId = req.userId;
    
       if(!userId){
        res.json({
            message:"error in userId"
        })
       }
    
       const UserContent = await ContentModel.create({
        Title: title,
        Link: link,
        Tags: [],
        Type: type,
        userId: new mongoose.Types.ObjectId(userId)
       })
    
       res.json({
        message: "Content created"
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

export async function getUserContent(req: Request,res: Response, next: NextFunction){
    try{
         const userId = req.userId;
    
         const content = await ContentModel.findOne({
            userId: new mongoose.Types.ObjectId(userId)
         })
    
         res.json({
            content
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

export async function deleteUserContent(req: Request,res: Response, next: NextFunction){
     try{
         const contentId = req.body.contentId
    
         const content = await ContentModel.deleteMany({
           _id: contentId,
           userId:  new mongoose.Types.ObjectId(req.userId)
         })
    
         res.status(200).json({
            message: "deleted content"
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

export async function generateShareLink(req: Request,res: Response, next: NextFunction){
    try{
         const share = req.body.share;
    
         if(share){
            const CheckExistingUserLink = await LinkModel.findOne({
                userId: new mongoose.Types.ObjectId(req.userId)
            })
            if(CheckExistingUserLink){
                return res.json({
                    hash: CheckExistingUserLink.hash
                })
            } 
             const hash = random(10);
                await LinkModel.create({
                    hash: hash,
                    userId:  new mongoose.Types.ObjectId(req.userId)
                })
            res.json({
                hash
            })
         } else{
            await LinkModel.deleteOne({
                userId: new mongoose.Types.ObjectId(req.userId)
            })
    
            res.json({
                message:'link removed'
            })
         }
    
         res.status(200).json({
            message: "Link created"
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

export async function userShareLink(req: Request,res: Response, next: NextFunction){
    try{
     const shareLink = req.params.shareLink;

     if(!shareLink){
        return res.json({
            message: "Wrong shareLink format"
        })
     }

     const hashLink = await LinkModel.findOne({
       hash: shareLink
     })
     
     if(!hashLink){
        return res.status(404).json({
            message: "Invalid link"
        })
     }
     const userId = hashLink?.userId;
     const content = await ContentModel.find({
        userId: userId
     })
     const userDetails = await UserModel.findOne({
        _id: userId
     })

      if (!userDetails) {
        return res.status(411).json({
            msg: "User not found"
        })
    }
     const username = userDetails.UserName;

     res.status(200).json({
        username,
        content
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
