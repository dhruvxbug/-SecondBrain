import express from "express";
import {UserRouter} from "./routes/User.route.js";
import mongoose from "mongoose";
import "dotenv/config"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/user/api/v1", UserRouter);


async function main(){
     app.listen(3000);
}
connectDB;
main();