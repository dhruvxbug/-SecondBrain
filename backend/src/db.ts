import mongoose, {model,Schema} from 'mongoose';
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    UserName: { type: String, unique: true, min:3, required: true},
    Password: { type: String, unique: true, min:3, required: true},
    Profile: {
        FirstName: { type: String, required: true},
        LastName: { type: String, required: true},
        Avatar: String,
        bio: String,
        Socials: {
            Github: String,
            LinkedIn: String
        }
    }
})

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
export const UserModel = model('User', UserSchema);
export const LinkModel = model('Link', LinkSchema);
export const ContentModel = model('Content', ContentSchema);