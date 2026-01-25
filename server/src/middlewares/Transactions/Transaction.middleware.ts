import { Request, Response } from "express";
import { ITransactionModel } from "../../models/IModels";
import TransactionController from "../../controllers/Transactions/Transaction.controller";
import logger from "../../configs/loggerConfig";
import { validateCreateTransactionData, validateUpdateTransactionData } from "./validations";

class TransactionMiddleware {
    private transactionController = new TransactionController();

    public async createTransaction(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Create transaction request received");
            const { amount, type, userId, categoryId, note, date } = req.body as Partial<ITransactionModel>;

            const transactionData = {
                amount,
                type,
                userId,
                categoryId,
                note,
                date: date ? new Date(date) : undefined,
            } as Partial<ITransactionModel>;

            if (!validateCreateTransactionData(transactionData)) {
                logger.warn({ userId, categoryId }, "Invalid transaction data");
                res.status(400).json({ message: "Invalid transaction data" });
                return;
            }

            const newTransaction = await this.transactionController.createTransaction(transactionData);

            logger.info({ transactionId: (newTransaction as any)._id }, "Transaction created successfully");
            res.status(201).json({
                message: "Transaction created successfully",
                transaction: newTransaction,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in create transaction middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getTransaction(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get transaction request received");
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                logger.warn("Transaction ID not provided");
                res.status(400).json({ message: "Transaction ID is required" });
                return;
            }

            const transaction = await this.transactionController.getTransaction(id as string);
            if (!transaction) {
                logger.warn({ transactionId: id }, "Transaction not found");
                res.status(404).json({ message: "Transaction not found" });
                return;
            }

            logger.info({ transactionId: id }, "Transaction fetched successfully");
            res.status(200).json({
                message: "Transaction fetched successfully",
                transaction,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get transaction middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getTransactionsByUser(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get transactions by user request received");
            const { userId } = req.params;

            if (!userId || Array.isArray(userId)) {
                logger.warn("User ID not provided");
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            const transactions = await this.transactionController.getTransactionsByUser(userId as string);

            logger.info({ userId }, "Transactions fetched successfully");
            res.status(200).json({
                message: "Transactions fetched successfully",
                transactions,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get transactions middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getTransactionsByUserAndCategory(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get transactions by user and category request received");
            const { userId, categoryId } = req.params;

            if (!userId || !categoryId || Array.isArray(userId) || Array.isArray(categoryId)) {
                logger.warn("User ID or Category ID not provided");
                res.status(400).json({ message: "User ID and Category ID are required" });
                return;
            }

            const transactions = await this.transactionController.getTransactionsByUserAndCategory(userId as string, categoryId as string);

            logger.info({ userId, categoryId }, "Transactions fetched successfully");
            res.status(200).json({
                message: "Transactions fetched successfully",
                transactions,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get transactions middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getTransactionsByUserAndType(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get transactions by user and type request received");
            const { userId, type } = req.params;

            if (!userId || !type || Array.isArray(userId) || Array.isArray(type)) {
                logger.warn("User ID or Type not provided");
                res.status(400).json({ message: "User ID and Type are required" });
                return;
            }

            const transactions = await this.transactionController.getTransactionsByUserAndType(userId as string, type as string);

            logger.info({ userId, type }, "Transactions fetched successfully");
            res.status(200).json({
                message: "Transactions fetched successfully",
                transactions,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get transactions middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async getTransactionsByUserAndDateRange(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Get transactions by user and date range request received");
            const { userId, startDate, endDate } = req.query;

            if (!userId || !startDate || !endDate) {
                logger.warn("User ID, startDate or endDate not provided");
                res.status(400).json({ message: "User ID, startDate and endDate are required" });
                return;
            }

            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                logger.warn("Invalid date format");
                res.status(400).json({ message: "Invalid date format" });
                return;
            }

            const transactions = await this.transactionController.getTransactionsByUserAndDateRange(
                userId as string,
                start,
                end
            );

            logger.info({ userId, startDate, endDate }, "Transactions fetched successfully");
            res.status(200).json({
                message: "Transactions fetched successfully",
                transactions,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in get transactions middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async updateTransaction(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Update transaction request received");
            const { id } = req.params;
            const { amount, type, note, date } = req.body as Partial<ITransactionModel>;

            if (!id || Array.isArray(id)) {
                logger.warn("Transaction ID not provided");
                res.status(400).json({ message: "Transaction ID is required" });
                return;
            }

            const transactionData = {
                amount,
                type,
                note,
                date: date ? new Date(date) : undefined,
            } as Partial<ITransactionModel>;

            if (!validateUpdateTransactionData(transactionData)) {
                logger.warn({ transactionId: id }, "Invalid update data");
                res.status(400).json({ message: "Invalid transaction data" });
                return;
            }

            const existingTransaction = await this.transactionController.getTransaction(id);
            if (!existingTransaction) {
                logger.warn({ transactionId: id }, "Transaction not found");
                res.status(404).json({ message: "Transaction not found" });
                return;
            }

            const updatedData: Partial<ITransactionModel> = {};
            if (amount) updatedData.amount = amount;
            if (type) updatedData.type = type;
            if (note) updatedData.note = note.trim();
            if (date) updatedData.date = new Date(date);

            const updatedTransaction = await this.transactionController.updateTransaction(id as string, updatedData);

            logger.info({ transactionId: id }, "Transaction updated successfully");
            res.status(200).json({
                message: "Transaction updated successfully",
                transaction: updatedTransaction,
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in update transaction middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }

    public async deleteTransaction(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            logger.info("Delete transaction request received");
            const { id } = req.params;

            if (!id || Array.isArray(id)) {
                logger.warn("Transaction ID not provided");
                res.status(400).json({ message: "Transaction ID is required" });
                return;
            }

            const existingTransaction = await this.transactionController.getTransaction(id as string);
            if (!existingTransaction) {
                logger.warn({ transactionId: id }, "Transaction not found");
                res.status(404).json({ message: "Transaction not found" });
                return;
            }

            await this.transactionController.deleteTransaction(id as string);

            logger.info({ transactionId: id }, "Transaction deleted successfully");
            res.status(200).json({
                message: "Transaction deleted successfully",
            });
        } catch (error: any) {
            logger.error(
                { error: error.message },
                "Error in delete transaction middleware"
            );
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
}

export default TransactionMiddleware;
