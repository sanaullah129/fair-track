export interface IEnvConfig {
    nodeEnv: string;
    port: number;
    mongodbUri: string;
    jwtSecret: string;
    jwtExpire: string;
    bcryptRounds: number;
    apiPrefix: string;
}
