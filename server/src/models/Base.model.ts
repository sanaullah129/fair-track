import { SchemaDefinition } from "mongoose";

// Base fields shared across models
export const baseFields: SchemaDefinition = {
  originalId: {
    type: String,
    required: false,
    trim: true,
  },
  createdBy: {
    type: String,
    required: true,
    trim: true,
  },
  updatedBy: {
    type: String,
    required: true,
    trim: true,
  },
};

export default baseFields;
