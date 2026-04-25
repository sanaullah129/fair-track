import { Request, Response, Router } from "express";
import userRoutes from "./routes/UserRoutes";
import categoryRoutes from "./routes/CategoryRoutes";
import transactionRoutes from "./routes/TransactionRoutes";
import profileRoutes from "./routes/ProfileRoutes";
import summaryRoutes from "./routes/SummaryRoutes";

const router = Router();

router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/transaction', transactionRoutes);
router.use('/profile', profileRoutes);
router.use('/summary', summaryRoutes);

/**
 * Health check route
 * Returns status 200 if the server is running
 */
router.get('/health', (req: Request, res: Response) => {
    res.status(200).send({ status: "OK" });
});

export default router;