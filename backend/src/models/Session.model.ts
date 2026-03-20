import mongoose, {model, Schema} from "mongoose";
const ObjectId = Schema.ObjectId;

const SessionSchema = new mongoose.Schema({
    UserId: {
        type: ObjectId,
        ref: "User",
        required: true
    }, 
    refreshTokenHash: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: [true, "IP address is required"]
    },
    userAgent: {
        type: String,
        required: [true, "User agent is required"]
    },
    revoked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export const SessionModel = model('Session', SessionSchema);