import type {NextFunction, Request, Response} from "express";
import {Router} from "express";
const UserRouter = Router();
import {jwt, bcrypt, z} from "../config.js";
import {TagModel, UserModel, ContentModel, LinkModel} from "../db.js"
import "dotenv/config"
import { UserMiddleware } from "../middleware.ts/userMiddleware.js";
import mongoose from "mongoose";
import {random} from "../util.js"
import { hash } from "node:crypto";


UserRouter.post("/signup", async function(req: Request,res: Response, next: NextFunction){
    try{
        // zod object schema and .safeParse for zod 
        const requiredBody  = z.object ({
        username: z.string().min(3).trim().max(10),
        password: z.string().trim().min(8,"Password must be at least 8 characters").max(20, "Password can't exceed 20 characters").regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,"Password must contain at least one letter and one number and one special character"),
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
    const {username, password, firstName, lastName, avatar, bio, github, linkedin} = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);

    //checking if user already exists
    const checkUsername = await UserModel.findOne({
        UserName: username
    })
    if(checkUsername){
        res.status(403).json({
            message: "User already exists"
        })
    }

    // create user
    await UserModel.create({
       UserName: username,
       Password: hashedPassword,
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
    res.status(200).json({
        message: "User Created"
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

});

UserRouter.post("/signin", async function(req: Request, res: Response, next: NextFunction){
    try{
      const {username,password} = req.body;

      //user check 
      const user = await UserModel.findOne({
        UserName: username
      });
      if(!user){
        return res.status(403).json({
            message: "User not found"
        })
      }

      // password check 
      const passwordCheck = await bcrypt.compare(password, user.Password);

      if(passwordCheck){
        const token = jwt.sign({id: user._id}, process.env.JWT_USER_SECRET as string, { expiresIn: '48h'});
        res.json({
            token: token
        })
      } else{
        res.status(403).json({
            message: "Error in generating jwt token,Wrong password"
        })
      }
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
})

UserRouter.post("/content",UserMiddleware, async function (req: Request, res: Response, next: NextFunction){
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
})

UserRouter.get("/content",UserMiddleware, async function (req: Request, res: Response, next: NextFunction){
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
})

UserRouter.delete("/content",UserMiddleware, async function (req: Request, res: Response, next: NextFunction){
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
})

UserRouter.post("/brain/share",UserMiddleware, async function (req: Request, res: Response, next: NextFunction){
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
})

UserRouter.get("/brain/:shareLink",UserMiddleware, async function (req: Request, res: Response, next: NextFunction){
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
})

export { UserRouter}