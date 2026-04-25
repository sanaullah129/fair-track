export interface IUserModel extends ICommonFields {
    username: string;
    email: string;
    password: string;
    type: UserType;
}

export enum UserType {
    ADMIN = "admin",
    USER = "user",
}

interface ICommonFields {
    createdAt: Date;
    updatedAt: Date;
    // Base fields for audit and replication
    originalId?: string;
    createdBy?: string;
    updatedBy?: string;
    // Soft delete fields
    deletedAt?: Date | null;
    deletedBy?: string | null;
}

export interface ITransactionModel extends ICommonFields {
    amount: number;
    date: Date;
    note?: string;
    type: TransactionType;
    userId: string;
    category: string;
    profileId: string;
}

export enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit",
}

export interface ICategoryModel extends ICommonFields {
    name: string;
    description?: string;
    userId: string;
}

export interface IProfileModel extends ICommonFields {
    name: string;
    userId: string;
    isActive: boolean;
}

export interface ISummaryModel extends ICommonFields {
    currentBalance: number;
    totalIncome: number;
    totalExpense: number;
    profileId: string;
}