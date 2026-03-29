import {Schema,model} from "mongoose"
const ObjectId = Schema.ObjectId;

const OTPSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    UserId: {
        type: ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    otpHash: {
        type: String,
        required: true 
    }, 
    createdAt:{
      type: Date,
      default: Date.now,
      expires: 3600
    } } ,{ timestamps: true })

export const OTPmodel = model('OTP', OTPSchema);