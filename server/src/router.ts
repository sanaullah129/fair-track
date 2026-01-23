import { Request, Response, Router } from "express";
import userRoutes from "./routes/UserRoutes";

const router = Router();


router.use('/user', userRoutes);

/**
 * Health check route
 * Returns status 200 if the server is running
 */
router.get('/health', (req: Request, res: Response) => {
    res.status(200).send({ status: "OK" });
});

export default router;