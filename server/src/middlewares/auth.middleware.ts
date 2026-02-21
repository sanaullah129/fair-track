import { Request, Response, NextFunction } from "express";
import logger from "../configs/loggerConfig";
import { verifyToken, JwtPayload } from "../helpers/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Read token from cookies instead of Authorization header
        const token = req.cookies.token;

        if (!token) {
            logger.warn({ path: req.path }, "No token provided");
            res.status(401).json({
                message: "No token provided",
            });
            return;
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            logger.warn({ path: req.path }, "Invalid or expired token");
            res.status(401).json({
                message: "Invalid or expired token",
            });
            return;
        }

        req.user = decoded;
        next();
    } catch (error: any) {
        logger.error(
            { error: error.message },
            "Error in auth middleware"
        );
        res.status(401).json({
            message: "Authentication failed",
            error: error.message,
        });
    }
};

export default authMiddleware;
