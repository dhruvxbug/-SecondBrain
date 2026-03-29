import {Router} from "express";
const UserRouter = Router();
import "dotenv/config"
import * as UserAuthMiddleware from "../middleware/User.Middleware.js";
import * as UserRegistrationController from "../controller/UserRegisteration.controller.js";
import * as UserActionController from "../controller/UserAction.controller.js";

//user creation 
UserRouter.post("/signup", UserRegistrationController.signup);
UserRouter.post("/signin", UserRegistrationController.signin);
UserRouter.post("/verify-email", UserRegistrationController.verifyEmail);
UserRouter.post("/send-otp", UserRegistrationController.sendOtpAgain);

//content related 
UserRouter.post("/content",UserAuthMiddleware.Authenticator, UserActionController.postUserContent);
UserRouter.get("/content",UserAuthMiddleware.Authenticator, UserActionController.getUserContent);
UserRouter.delete("/content",UserAuthMiddleware.Authenticator, UserActionController.deleteUserContent);

// content sharing
UserRouter.post("/brain/share",UserAuthMiddleware.Authenticator, UserActionController.generateShareLink);
UserRouter.get("/brain/:shareLink",UserAuthMiddleware.Authenticator, UserActionController.userShareLink);

// Auth 
UserRouter.post("/refreshToken",UserAuthMiddleware.refreshToken);
UserRouter.delete("/logout", UserAuthMiddleware.logout);
UserRouter.delete("/logout-all", UserAuthMiddleware.logoutAll);

export { UserRouter}