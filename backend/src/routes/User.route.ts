import {Router} from "express";
const UserRouter = Router();
import "dotenv/config"
import * as UserAuthMiddleware from "../middleware/User.Middleware.js";
import * as UserController from "../controller/User.controller.js";

//user creation 
UserRouter.post("/signup", UserController.signup);
UserRouter.post("/signin", UserController.signin);
UserRouter.post("/verify-email", UserController.verifyEmail);

//content related 
UserRouter.post("/content",UserAuthMiddleware.Authenticator, UserController.postUserContent);
UserRouter.get("/content",UserAuthMiddleware.Authenticator, UserController.getUserContent);
UserRouter.delete("/content",UserAuthMiddleware.Authenticator, UserController.deleteUserContent);

// content sharing
UserRouter.post("/brain/share",UserAuthMiddleware.Authenticator, UserController.generateShareLink);
UserRouter.get("/brain/:shareLink",UserAuthMiddleware.Authenticator, UserController.userShareLink);

// Auth 
UserRouter.post("/refreshToken",UserAuthMiddleware.refreshToken);
UserRouter.delete("/logout", UserAuthMiddleware.logout);
UserRouter.delete("/logout-all", UserAuthMiddleware.logoutAll);

export { UserRouter}