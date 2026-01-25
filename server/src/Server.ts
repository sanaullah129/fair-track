import express from "express";
import type { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { IEnvConfig } from "./configs/IEnvConfig";
import logger from "./configs/loggerConfig";
import { getSwaggerOptions } from "./configs/swaggerConfig";
import router from "./router";

export default class Server {
    private app: Express;
    constructor(private config: IEnvConfig) {
        // Initialize server
        this.app = express();
    }

    get application(): Express {
        return this.app;
    }

    public async bootstrap(): Promise<void> {
        await this.connectDb();
        this.setUpBodyParser();
        this.setUpCors();
        this.setUpSwagger();
        this.setUpRoutes();
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

    private setUpRoutes(): void {
        const { apiPrefix } = this.config;
        this.app.use(apiPrefix, router);

        // Global 404 handler for undefined routes
        this.app.use((req, res) => {
            logger.warn(
                { method: req.method, path: req.path },
                "Route not found"
            );
            res.status(404).json({
                message: "Route not found",
                path: req.path,
                method: req.method,
            });
        });
    }

    private setUpSwagger(): void {
        const swaggerSpec = getSwaggerOptions(this.config);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                persistAuthorization: true,
            },
            customCss: '.swagger-ui .topbar { display: none }',
        }));
        logger.info('Swagger UI available at /api-docs');
    }

     public setUpBodyParser(): void {
        this.app.use(bodyParser.json({ limit: '100mb' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    public setUpCors(): void {
        this.app.use(cors());
    }

    public run(): void {
        const { port = 3001 } = this.config;
        this.app.listen(port, () => {
            logger.info(`[server]: Server is running at http://localhost:${port}`);
        });
    }
}