import TransactionRepository from "../../repositories/Transactions/Transaction.repository";
import logger from "../../configs/loggerConfig";
import type { ITransactionModel } from "../../models/IModels";

class TransactionController {
    private _transactionRepository: TransactionRepository;
    constructor() {
        this._transactionRepository = new TransactionRepository();
    }

    public async getTransaction(id: string): Promise<ITransactionModel | null> {
        try {
            logger.info({ transactionId: id }, "Fetching transaction by id");
            const transaction = await this._transactionRepository.findTransactionById(id);
            if (!transaction) {
                logger.warn({ transactionId: id }, "Transaction not found");
            }
            return transaction;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching transaction"
            );
            throw error;
        }
    }

    public async getTransactionsByUser(userId: string): Promise<ITransactionModel[]> {
        try {
            logger.info({ userId }, "Fetching transactions by user");
            const transactions = await this._transactionRepository.findTransactionsByUserId(userId);
            return transactions;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching transactions"
            );
            throw error;
        }
    }

    public async getTransactionsByUserAndCategory(
        userId: string,
        categoryId: string
    ): Promise<ITransactionModel[]> {
        try {
            logger.info({ userId, categoryId }, "Fetching transactions by user and category");
            const transactions = await this._transactionRepository.findTransactionsByUserAndCategory(
                userId,
                categoryId
            );
            return transactions;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching transactions"
            );
            throw error;
        }
    }

    public async getTransactionsByUserAndType(
        userId: string,
        type: string
    ): Promise<ITransactionModel[]> {
        try {
            logger.info({ userId, type }, "Fetching transactions by user and type");
            const transactions = await this._transactionRepository.findTransactionsByUserAndType(
                userId,
                type
            );
            return transactions;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching transactions"
            );
            throw error;
        }
    }

    public async getTransactionsByUserAndDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<ITransactionModel[]> {
        try {
            logger.info(
                { userId, startDate, endDate },
                "Fetching transactions by user and date range"
            );
            const transactions = await this._transactionRepository.findTransactionsByUserAndDateRange(
                userId,
                startDate,
                endDate
            );
            return transactions;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error fetching transactions"
            );
            throw error;
        }
    }

    public async createTransaction(
        transactionData: Partial<ITransactionModel>
    ): Promise<ITransactionModel> {
        try {
            logger.info({ userId: transactionData.userId }, "Creating new transaction");
            const transaction = await this._transactionRepository.createTransaction(transactionData);
            logger.info(
                { transactionId: (transaction as any)._id },
                "Transaction created successfully"
            );
            return transaction;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error creating transaction"
            );
            throw error;
        }
    }

    public async updateTransaction(
        id: string,
        transactionData: Partial<ITransactionModel>
    ): Promise<ITransactionModel | null> {
        try {
            logger.info({ transactionId: id }, "Updating transaction");
            const transaction = await this._transactionRepository.updateTransaction(id, transactionData);
            if (!transaction) {
                logger.warn({ transactionId: id }, "Transaction not found for update");
            } else {
                logger.info({ transactionId: id }, "Transaction updated successfully");
            }
            return transaction;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error updating transaction"
            );
            throw error;
        }
    }

    public async deleteTransaction(id: string): Promise<boolean> {
        try {
            logger.info({ transactionId: id }, "Deleting transaction");
            const result = await this._transactionRepository.deleteTransaction(id);
            if (result) {
                logger.info({ transactionId: id }, "Transaction deleted successfully");
            } else {
                logger.warn({ transactionId: id }, "Transaction not found for deletion");
            }
            return result;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error deleting transaction"
            );
            throw error;
        }
    }
}

export default TransactionController;
