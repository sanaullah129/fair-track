import mongoose from "mongoose";
import { ITransactionModel, TransactionType } from "./IModels";
import type { Model } from "mongoose";

const TransactionSchema = new mongoose.Schema<ITransactionModel>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v: number) {
          return v > 0;
        },
        message: "Amount must be greater than 0",
      },
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    profileId: {
      type: String,
      required: true,
      ref: "Profile",
    },
    categoryId: {
      type: String,
      required: true,
      ref: "Category",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ categoryId: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ profileId: 1 });

const TransactionModel: Model<ITransactionModel> =
  mongoose.model<ITransactionModel>("Transaction", TransactionSchema);

export default TransactionModel;
