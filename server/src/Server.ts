import { IEnvConfig } from "configs/IEnvConfig";
import logger from "./configs/loggerConfig";
import type { Express } from "express";
import express from "express";
import mongoose from "mongoose";
import router from "router";

export default class Server {
    private app: Express;
    constructor(private config: IEnvConfig) {
        // Initialize server
        this.app = express();
    }

    get application(): Express {
        return this.app;
    }

    public bootstrap(): void {
        this.connectDb();

    }

    private async connectDb(): Promise<void> {
        try {
            const { mongodbUri } = this.config;
            logger.info('Connecting to MongoDB...');
            await mongoose.connect(mongodbUri);
            logger.info('MongoDB connected successfully');
        } catch (error: any) {
            logger.error('[server]: Unable to connect to the database: ' + (error?.message || error));
            process.exit(1);
        }
    }

    private async setUpRoutes(): Promise<void> {
        const { apiPrefix } = this.config;
        this.app.use(apiPrefix, router)
    }

    public run(): void {
        const { port = 3001 } = this.config;
        this.app.listen(port, () => {
            logger.info(`[server]: Server is running at http://localhost:${port}`);
        });
    }
}