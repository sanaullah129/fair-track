import TransactionRepository from "../../repositories/Transactions/Transaction.repository";
import ProfileRepository from "../../repositories/Profiles/Profile.repository";
import SummaryRepository from "../../repositories/Summary/Summary.repository";
import logger from "../../configs/loggerConfig";
import type { ITransactionModel } from "../../models/IModels";

class TransactionController {
    private _transactionRepository: TransactionRepository;
    private _summaryRepository: SummaryRepository;
    constructor() {
        this._transactionRepository = new TransactionRepository();
        this._summaryRepository = new SummaryRepository();
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

    public async getTransactionsByUserProfile(
        userId: string, 
        profileId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ transactions: ITransactionModel[]; total: number }> {
        try {
            logger.info({ userId, profileId, page, limit }, "Fetching transactions by user and profile with pagination");
            const result = await this._transactionRepository.findTransactionsByUserProfile(userId, profileId, page, limit);
            return result;
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

            // Validate that profile belongs to the user
            if (!transactionData.profileId || !transactionData.userId) {
                throw new Error("profileId and userId are required");
            }
            const profileRepo = new ProfileRepository();
            const profile = await profileRepo.findProfileById(transactionData.profileId);
            if (!profile) {
                throw new Error("Profile not found");
            }
            if (profile.userId.toString() !== transactionData.userId.toString()) {
                throw new Error("Profile does not belong to the user");
            }

            const transaction = await this._transactionRepository.createTransaction(transactionData);
            logger.info(
                { transactionId: (transaction as any)._id },
                "Transaction created successfully"
            );

            // Update summary asynchronously without await
            this._summaryRepository.updateSummaryOnTransactionCreate(transaction);

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
        transactionId: string,
        userId: string,
        transactionData: Partial<ITransactionModel>
    ): Promise<ITransactionModel | null> {
        try {
            logger.info({ transactionId, userId }, "Updating transaction");

            const transaction = await this._transactionRepository.updateTransaction(
                transactionId,
                userId,
                transactionData
            );

            if (!transaction) {
                logger.warn({ transactionId, userId }, "Transaction not found for update");
                return null;
            }

            logger.info({ transactionId, userId }, "Transaction updated successfully");

            this._summaryRepository.recomputeSummaryForProfile(userId, transaction.profileId).catch(console.error);
            return transaction;
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error updating transaction"
            );
            throw error;
        }
    }

    public async deleteTransaction(id: string, userId: string): Promise<ITransactionModel | null> {
        try {
            logger.info({ transactionId: id, userId }, "Deleting transaction");

            const deletedTransaction = await this._transactionRepository.deleteTransaction(id, userId);
            if (!deletedTransaction) {
                logger.warn({ transactionId: id, userId }, "Transaction not found for deletion");
                return null;
            }

            logger.info({ transactionId: id, userId }, "Transaction deleted successfully");

            // Recompute summary asynchronously without affecting response
            this._summaryRepository.recomputeSummaryForProfile(userId, deletedTransaction.profileId).catch(console.error);
            return deletedTransaction;
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
