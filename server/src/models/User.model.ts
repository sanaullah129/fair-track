import mongoose from "mongoose";
import { IUserModel, UserType } from "./IModels";
import type { Model } from "mongoose";

const UsersSchema = new mongoose.Schema<IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    type: {
      type: String,
      enum: Object.values(UserType),
      required: true,
      default: UserType.USER,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
UsersSchema.index({ username: 1 });
UsersSchema.index({ email: 1 });

const UserModel: Model<IUserModel> = mongoose.model<IUserModel>(
  "Users",
  UsersSchema
);

export default UserModel;