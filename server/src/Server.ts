import type { Express } from "express";
import express from "express";

export default class Server {
    private app: Express;
    constructor(private config: any) {
        // Initialize server
        this.app = express();
    }
    
     get application(): Express {
        return this.app;
    }

    public bootstrap(): void {
        // Start server logic here
    }

    public run(): void {
        const { port = 3001 } = this.config;
        this.app.listen(port, () => {
             console.info(`[server]: Server is running at http://localhost:${port}`);
        });
    }
}