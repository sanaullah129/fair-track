import { ITransactionModel } from "../../models/IModels";
import TransactionModel from "../../models/Transaction.model";

class TransactionRepository {
    constructor() {}

    public async findTransactionById(id: string): Promise<ITransactionModel | null> {
        const transaction = await TransactionModel.findOne({ _id: id, deletedAt: null });
        return transaction;
    }

    public async findTransactionsByUserProfile(
        userId: string, 
        profileId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ transactions: ITransactionModel[]; total: number }> {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            TransactionModel.find({ userId, profileId, deletedAt: null })
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit),
            TransactionModel.countDocuments({ userId, profileId, deletedAt: null })
        ]);
        return { transactions, total };
    }

    public async findTransactionsByUserAndCategory(
        userId: string,
        categoryId: string
    ): Promise<ITransactionModel[]> {
        const transactions = await TransactionModel.find({
            userId,
            categoryId,
            deletedAt: null,
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
            deletedAt: null,
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
            deletedAt: null,
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

    public async deleteTransaction(id: string, deletedBy: string): Promise<boolean> {
        const result = await TransactionModel.findByIdAndUpdate(
            id,
            {
                deletedAt: new Date(),
                deletedBy,
            },
            { new: true }
        );
        return !!result;
    }

    public async updateTransactionProfile(
        oldProfileId: string,
        newProfileId: string,
        userId: string
    ): Promise<{ modifiedCount: number }> {
        const result = await TransactionModel.updateMany(
            { profileId: oldProfileId, userId, deletedAt: null },
            { profileId: newProfileId }
        );
        return { modifiedCount: result.modifiedCount };
    }
}

export default TransactionRepository;
