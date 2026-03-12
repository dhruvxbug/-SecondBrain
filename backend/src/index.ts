import express from "express";
import {UserRouter} from "./routes/user.js";
import mongoose from "mongoose";
import "dotenv/config"

const app = express()
app.use(express.json());
app.use("/user/api/v1", UserRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL as string);
    app.listen(3000);
}

main();