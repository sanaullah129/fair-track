// Existing API type definitions

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
  };
  token: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ProfileModel {
  _id: string;
  name: string;
  userId: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const TransactionType = {
  CREDIT: "credit",
  DEBIT: "debit",
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface TransactionRequest {
  amount: number;
  type: TransactionType;
  userId: string;
  profileId: string;
  category: string;
  note?: string;
  date?: string;
}

export interface TransactionResponse {
  _id: string;
  amount: number;
  date: string;
  note?: string;
  type: TransactionType;
  userId: string;
  profileId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// New Summary model definition
export interface SummaryModel {
  profileId: string;
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
}
