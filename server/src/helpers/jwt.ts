import jwt, { SignOptions } from 'jsonwebtoken';
import envConfig from '../configs/envConfig';

export interface JwtPayload {
    userId: string;
    username: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: envConfig.jwtExpire as any,
    };
    return jwt.sign(payload, envConfig.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, envConfig.jwtSecret) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
