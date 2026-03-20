import mongoose from "mongoose";

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URL as string);
}

export default connectDB();