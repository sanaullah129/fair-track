import mongoose from "mongoose";
import { ISummaryModel } from "./IModels";

const SummarySchema = new mongoose.Schema<ISummaryModel>(
  {
    profileId: {
      type: String,
      required: true,
      unique: true,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpense: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

SummarySchema.index({ profileId: 1 });

const SummaryModel = mongoose.model<ISummaryModel>("Summary", SummarySchema);
export default SummaryModel;