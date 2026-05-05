import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
    userId: string;
    email: string;
}

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN ?? "1h",
    });
};

/**
 * Verify JWT Token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
};