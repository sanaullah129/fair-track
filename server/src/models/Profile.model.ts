import mongoose from "mongoose";
import type { Model } from "mongoose";
import { IProfileModel } from "./IModels";

const ProfileSchema = new mongoose.Schema<IProfileModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    userId: {
      type: String,
      required: true,
      ref: "Users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
ProfileSchema.index({ userId: 1 });

const ProfileModel: Model<IProfileModel> = mongoose.model<IProfileModel>(
  "Profile",
  ProfileSchema
);

export default ProfileModel;
