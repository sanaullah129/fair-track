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
}

export interface ITransactionModel extends ICommonFields {
    amount: number;
    date: Date;
    note?: string;
    type: TransactionType;
    userId: string;
    categoryId: string;
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