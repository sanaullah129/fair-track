import { ITransactionModel, TransactionType } from "../../models/IModels";

const validateCreateTransactionData = (data: Partial<ITransactionModel>): boolean => {
    if (!data.amount || !data.type || !data.userId || !data.categoryId) {
        return false;
    }

    if (typeof data.amount !== "number" || data.amount <= 0) {
        return false;
    }

    if (!Object.values(TransactionType).includes(data.type as TransactionType)) {
        return false;
    }

    if (typeof data.userId !== "string" || data.userId.trim().length === 0) {
        return false;
    }

    if (typeof data.categoryId !== "string" || data.categoryId.trim().length === 0) {
        return false;
    }

    if (data.note && typeof data.note !== "string") {
        return false;
    }

    if (data.note && data.note.length > 500) {
        return false;
    }

    if (data.date && !(data.date instanceof Date)) {
        return false;
    }

    return true;
};

const validateUpdateTransactionData = (data: Partial<ITransactionModel>): boolean => {
    if (data.amount) {
        if (typeof data.amount !== "number" || data.amount <= 0) {
            return false;
        }
    }

    if (data.type) {
        if (!Object.values(TransactionType).includes(data.type as TransactionType)) {
            return false;
        }
    }

    if (data.note) {
        if (typeof data.note !== "string") {
            return false;
        }

        if (data.note.length > 500) {
            return false;
        }
    }

    if (data.date) {
        if (!(data.date instanceof Date)) {
            return false;
        }
    }

    return true;
};

export { validateCreateTransactionData, validateUpdateTransactionData };
