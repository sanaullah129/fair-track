
import mongoose from "mongoose";
import type { Model } from "mongoose";
import { IProfileModel } from "./IModels";
import baseFields from "./Base.model";

const ProfileSchema = new mongoose.Schema<IProfileModel>(
  {
    ...baseFields,
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
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
ProfileSchema.index({ userId: 1, isActive: 1 });

const ProfileModel: Model<IProfileModel> = mongoose.model<IProfileModel>(
  "Profile",
  ProfileSchema
);

export default ProfileModel;
