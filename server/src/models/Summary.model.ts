import mongoose from "mongoose";
import { ISummaryModel } from "./IModels";
import baseFields from "./Base.model";

const SummarySchema = new mongoose.Schema<ISummaryModel>(
  {
    ...baseFields,
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


const SummaryModel = mongoose.model<ISummaryModel>("Summary", SummarySchema);
export default SummaryModel;