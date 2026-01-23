import mongoose from "mongoose";
import { ICategoryModel } from "./IModels";
import type { Model } from "mongoose";

const CategorySchema = new mongoose.Schema<ICategoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
CategorySchema.index({ userId: 1 });
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const CategoryModel: Model<ICategoryModel> = mongoose.model<ICategoryModel>(
  "Category",
  CategorySchema
);

export default CategoryModel;
