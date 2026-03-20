import mongoose, { Schema, model } from "mongoose";
const ObjectId = Schema.ObjectId;
import {UserModel} from "./User.model.js"

const contentTypes = ['images','video','audio','article'];

const ContentSchema = new Schema({
    Link: {type: String, min:3},
    Title: {type: String},
    Tags: [{type: ObjectId, ref: 'Tag'}],
    Type: {type:String, enum: contentTypes},
    userId: {type: ObjectId, ref: 'User', required: true},
})

const TagSchema = new Schema({
    Title: {type: String, required: true, unique: true}
});

const LinkSchema = new Schema({
    hash: String,
    userId: {type: ObjectId, 
              ref:'User',
              required: true,
              validate: async function(value: mongoose.Types.ObjectId){
                const user = await UserModel.findById(value);
                if (!user){
                    throw new Error('User does not exist');
                }
              }}
})

export const TagModel = model('Tag', TagSchema);
export const LinkModel = model('Link', LinkSchema);
export const ContentModel = model('Content', ContentSchema);