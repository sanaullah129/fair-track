import dotenv from 'dotenv';
import { IEnvConfig } from './IEnvConfig';

dotenv.config();

const envConfig: IEnvConfig = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fair-track',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  jwtExpire: process.env.JWT_EXPIRE || '1d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  apiPrefix: '/api',
});

export default envConfig;
