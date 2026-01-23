import { Router } from "express";

const router = Router();

/**
 * Health check route
 * Returns status 200 if the server is running
 */
router.get("/health", (req, res) => {
    res.status(200).send({ status: "OK" });
});

export default router;