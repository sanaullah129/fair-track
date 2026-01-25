import { ITransactionModel } from "../../models/IModels";
import TransactionModel from "../../models/Transaction.model";

class TransactionRepository {
    constructor() {}

    public async findTransactionById(id: string): Promise<ITransactionModel | null> {
        const transaction = await TransactionModel.findById(id);
        return transaction;
    }

    public async findTransactionsByUserId(userId: string): Promise<ITransactionModel[]> {
        const transactions = await TransactionModel.find({ userId }).sort({ date: -1 });
        return transactions;
    }

    public async findTransactionsByUserAndCategory(
        userId: string,
        categoryId: string
    ): Promise<ITransactionModel[]> {
        const transactions = await TransactionModel.find({
            userId,
            categoryId,
        }).sort({ date: -1 });
        return transactions;
    }

    public async findTransactionsByUserAndType(
        userId: string,
        type: string
    ): Promise<ITransactionModel[]> {
        const transactions = await TransactionModel.find({
            userId,
            type,
        }).sort({ date: -1 });
        return transactions;
    }

    public async findTransactionsByUserAndDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<ITransactionModel[]> {
        const transactions = await TransactionModel.find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({ date: -1 });
        return transactions;
    }

    public async createTransaction(
        transactionData: Partial<ITransactionModel>
    ): Promise<ITransactionModel> {
        const newTransaction = new TransactionModel(transactionData);
        const savedTransaction = await newTransaction.save();
        return savedTransaction.toObject();
    }

    public async updateTransaction(
        id: string,
        transactionData: Partial<ITransactionModel>
    ): Promise<ITransactionModel | null> {
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            id,
            transactionData,
            { new: true }
        );
        return updatedTransaction;
    }

    public async deleteTransaction(id: string): Promise<boolean> {
        const result = await TransactionModel.findByIdAndDelete(id);
        return !!result;
    }
}

export default TransactionRepository;
