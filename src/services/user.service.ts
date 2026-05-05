import { db } from "../config/db";
import bcrypt from "bcrypt";

export interface User {
    id: number;
    userId: string;
    email: string;
    password: string;
    fullName?: string;
    profileImage?: string;
    fcmToken?: string;
    createdAt: number;
    updatedAt: number;
}

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
    const [rows]: any = await db.execute(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    return rows.length ? rows[0] : null;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
    const [rows]: any = await db.execute(
        "SELECT userId, email, fullName, profileImage, fcmToken FROM users WHERE userId = ? LIMIT 1",
        [userId]
    );

    return rows.length ? rows[0] : null;
};

/**
 * Create new user (signup)
 */
export const createUser = async (
    userId: string,
    email: string,
    password: string,
    createdAt: number
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await db.execute(
        "INSERT INTO users (userId, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [userId, email, hashedPassword, createdAt, createdAt]
    );

    return {
        id: result.insertId,
        userId,
        email,
        password: hashedPassword,
        createdAt,
        updatedAt: createdAt,
    } as User;
};

/**
 * Save / Update FCM token
 */
export const saveFCMToken = async (
    userId: string,
    token: string
): Promise<void> => {
    await db.execute(
        "UPDATE users SET fcmToken = ? WHERE userId = ?",
        [token, userId]
    );
};

/**
 * Clear the user's FCM token on logout so notifications stop.
 */
export const clearFCMToken = async (userId: string): Promise<void> => {
    await db.execute(
        "UPDATE users SET fcmToken = NULL WHERE userId = ?",
        [userId]
    );
};

/**
 * Get all users with FCM tokens (for bulk notifications)
 */
export const getAllUsersWithTokens = async (): Promise<
    { userId: string; fcmToken: string }[]
> => {
    const [rows]: any = await db.execute(
        "SELECT userId, fcmToken FROM users WHERE fcmToken IS NOT NULL"
    );

    return rows;
};