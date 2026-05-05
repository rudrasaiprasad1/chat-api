import { Request, Response } from "express";
import { saveFCMToken, getUserById } from "../services/user.service";
import { successResponse, errorResponse } from "../utils/response";

export const saveToken = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId; // from JWT middleware
        const token = req.body.token || req.body.fcmToken || req.body.fcm_token;

        console.log("Saving FCM token for user", userId, token);

        if (!token) {
            return res.status(400).json(errorResponse("Token is required"));
        }

        await saveFCMToken(userId, token);

        res.json(successResponse("FCM token saved successfully"));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const getCurrentUser = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;

        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json(errorResponse("User not found"));
        }

        res.json(successResponse("User retrieved successfully", user));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};