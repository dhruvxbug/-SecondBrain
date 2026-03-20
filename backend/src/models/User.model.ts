import mongoose, {model,Schema} from 'mongoose';
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    UserName: { type: String, unique: true, min:3, required: [true, "Username is required"]},
    Email: {type: String, unique: true, min: 3, required: [true, "Email is required"]},
    HashedPassword: { type: String, unique: true, min:3, required: [true, "Password is required"]},
    Profile: {
        FirstName: { type: String, required: true},
        LastName: { type: String, required: true},
        Avatar: String,
        bio: String,
        Socials: {
            Github: String,
            LinkedIn: String
        }
    },
    verified: {
        type: Boolean,
        default: false
    }
})

export const UserModel = model('User', UserSchema);