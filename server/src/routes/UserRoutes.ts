import { Router, Request, Response } from "express";
import UserMiddleware from "../middlewares/User/User.middleware";

const router = Router();
const userMiddleware = new UserMiddleware();

/**
 * POST /api/user/sign-up
 * Sign up a new user
 */
router.post('/sign-up', userMiddleware.signUp);

export default router;