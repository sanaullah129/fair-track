export interface IEnvConfig {
    nodeEnv: string;
    port: number;
    mongodbUri: string;
    jwtSecret: string;
    jwtExpire: unknown;
    bcryptRounds: number;
    apiPrefix: string;
}
