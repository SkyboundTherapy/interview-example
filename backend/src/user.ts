import mongoose, {Schema} from "mongoose";
import passportLocalMongoose, {
  PassportLocalMongooseDocument,
  PassportLocalMongooseModel,
} from "passport-local-mongoose";

export interface UserType {
  name: string;
  email: string;
  admin: boolean;
}

export interface UserDocument extends UserType, PassportLocalMongooseDocument {}

const userSchema = new Schema<UserDocument>(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    admin: {type: Boolean, required: true, default: false},
  },
  {strict: "throw", toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

userSchema.plugin(passportLocalMongoose, {
  usernameUnique: true,
  usernameField: "email",
  usernameCaseInsensitive: true,
});

export const User = mongoose.model<UserDocument, PassportLocalMongooseModel<UserDocument>>(
  "User",
  userSchema
);
