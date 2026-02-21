import { Request, Response, NextFunction } from "express";
import logger from "../configs/loggerConfig";

// Middleware to populate createdBy/updatedBy and userId where appropriate
export const auditMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.user?.userId;

    // Only populate if we have an authenticated user
    if (!userId) {
      return next();
    }

    // For create requests, set createdBy and updatedBy and ensure userId matches authenticated user
    if (req.method === "POST") {
      // Do not overwrite if client explicitly set these, but prefer server-set values
      req.body = req.body || {};
      req.body.createdBy = userId;
      req.body.updatedBy = userId;

      // If the resource accepts a userId, ensure it's the authenticated user
      if (!req.body.userId) {
        req.body.userId = userId;
      }
    }

    // For update requests, set updatedBy
    if (req.method === "PUT" || req.method === "PATCH") {
      req.body = req.body || {};
      req.body.updatedBy = userId;
    }

    next();
  } catch (error: any) {
    logger.error({ error: error.message }, "Error in audit middleware");
    // don't block operations for audit failures; proceed without audit fields
    next();
  }
};

export default auditMiddleware;
