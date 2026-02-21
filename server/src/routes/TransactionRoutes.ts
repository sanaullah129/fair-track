import { Router, Request, Response } from "express";
import TransactionMiddleware from "../middlewares/Transactions/Transaction.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import auditMiddleware from "../middlewares/audit.middleware";

const router = Router();
const transactionMiddleware = new TransactionMiddleware();

// Apply auth and audit middleware to all transaction routes
router.use(authMiddleware);
router.use(auditMiddleware);

/**
 * @swagger
 * /transaction:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Create a new transaction
 *     description: Create a new expense or income transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - userId
 *               - categoryId
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 50.00
 *               type:
 *                 type: string
 *                 enum: [credit, debit]
 *                 example: debit
 *               userId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               categoryId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               note:
 *                 type: string
 *                 maxLength: 500
 *                 example: Weekly groceries
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-25T10:30:00Z
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid transaction data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req: Request, res: Response) => transactionMiddleware.createTransaction(req, res));

/**
 * @swagger
 * /transaction/user/date-range:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get transactions by date range
 *     description: Retrieve all transactions for a user within a specific date range
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-01-01T00:00:00Z
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-01-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions fetched successfully
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Missing required parameters or invalid date format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/date-range', (req: Request, res: Response) => 
    transactionMiddleware.getTransactionsByUserAndDateRange(req, res)
);

/**
 * @swagger
 * /transaction/user/{userId}/category/{categoryId}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get transactions by user and category
 *     description: Retrieve all transactions for a user filtered by a specific category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions fetched successfully
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: User ID and Category ID are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:userId/category/:categoryId', (req: Request, res: Response) => 
    transactionMiddleware.getTransactionsByUserAndCategory(req, res)
);

/**
 * @swagger
 * /transaction/user/{userId}/type/{type}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get transactions by user and type
 *     description: Retrieve all transactions for a user filtered by type (credit or debit)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [credit, debit]
 *         example: debit
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions fetched successfully
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: User ID and Type are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:userId/type/:type', (req: Request, res: Response) => 
    transactionMiddleware.getTransactionsByUserAndType(req, res)
);

/**
 * @swagger
 * /transaction/user/{userId}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get all transactions for a user
 *     description: Retrieve all transactions created by a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions fetched successfully
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/user/:userId', (req: Request, res: Response) => transactionMiddleware.getTransactionsByUser(req, res));

/**
 * @swagger
 * /transaction/{id}:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get transaction by ID
 *     description: Retrieve a specific transaction by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Transaction fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction fetched successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Transaction ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req: Request, res: Response) => transactionMiddleware.getTransaction(req, res));

/**
 * @swagger
 * /transaction/{id}:
 *   put:
 *     tags:
 *       - Transaction
 *     summary: Update a transaction
 *     description: Update an existing transaction's amount, type, note, and/or date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 75.00
 *               type:
 *                 type: string
 *                 enum: [credit, debit]
 *                 example: debit
 *               note:
 *                 type: string
 *                 maxLength: 500
 *                 example: Updated grocery notes
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-26T10:30:00Z
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction updated successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Transaction ID is required or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (req: Request, res: Response) => transactionMiddleware.updateTransaction(req, res));

/**
 * @swagger
 * /transaction/{id}:
 *   delete:
 *     tags:
 *       - Transaction
 *     summary: Delete a transaction
 *     description: Delete a transaction by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully
 *       400:
 *         description: Transaction ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req: Request, res: Response) => transactionMiddleware.deleteTransaction(req, res));

export default router;
