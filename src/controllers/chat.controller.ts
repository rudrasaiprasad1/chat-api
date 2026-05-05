// src/controllers/chat.controller.ts

import { Request, Response } from "express";
import {
    saveMessage,
    getMessagesByRoom,
    createChatRoom,
    getMyRoomsByUser,
    markMessageRead,
} from "../services/chat.service";
import { getAllUsersWithTokens } from "../services/user.service";
import { sendPushNotificationToTokens } from "../services/notification.service";
import { successResponse, errorResponse } from "../utils/response";

/**
 * GET /api/chat/:roomId
 * Get room chat history
 */
export const getChatHistory = async (
    req: Request,
    res: Response
) => {
    try {
        const { roomId } = req.params;
        const limit = Number(req.query.limit) || 50;

        if (!roomId) {
            return res.status(400).json(errorResponse("Room id is required"));
        }

        const messages = await getMessagesByRoom(`${roomId}`, limit);

        res.json(
            successResponse("Chat history fetched successfully", {
                count: messages.length,
                data: messages,
            })
        );
    } catch (err: any) {
        res.status(500).json(errorResponse(err.message || "Failed to fetch chat history"));
    }
};

/**
 * GET /api/chat/rooms/my
 * Get current user's rooms
 */
export const getMyRooms = async (
    req: any,
    res: Response
) => {
    try {
        const userId = req.user?.userId;

        const rooms = await getMyRoomsByUser(userId);

        res.json(
            successResponse("Rooms fetched successfully", {
                count: rooms.length,
                data: rooms,
            })
        );
    } catch (err: any) {
        res.status(500).json(errorResponse(err.message || "Failed to fetch rooms"));
    }
};

/**
 * POST /api/chat/rooms
 * Create a new room
 */
export const createRoom = async (
    req: any,
    res: Response
) => {
    try {
        const { roomName, roomType } = req.body;
        const ownerId = req.user?.userId;

        if (!roomName || !roomType) {
            return res.status(400).json(errorResponse("roomName and roomType are required"));
        }

        const room = await createChatRoom(
            roomName,
            roomType,
            ownerId,
            Date.now()
        );

        res.status(201).json(successResponse("Room created successfully", room));
    } catch (err: any) {
        res.status(500).json(errorResponse(err.message || "Failed to create room"));
    }
};

/**
 * POST /api/chat/send
 * Save message from REST API
 */
export const sendMessage = async (
    req: any,
    res: Response
) => {
    try {
        const { roomId, message } = req.body;

        const senderId = req.user?.userId;
        const senderName = req.user?.email || "User";

        if (!roomId || !message) {
            return res.status(400).json(errorResponse("roomId and message are required"));
        }

        const saved = await saveMessage(
            roomId,
            senderId,
            senderName,
            message,
            Date.now()
        );

        const allTokens = await getAllUsersWithTokens();
        const recipientTokens = allTokens
            .filter((user) => user.userId !== senderId && user.fcmToken)
            .map((user) => user.fcmToken as string);

        if (recipientTokens.length) {
            await sendPushNotificationToTokens(
                recipientTokens,
                `New message from ${senderName}`,
                message
            );
        }

        res.status(201).json(successResponse("Message sent successfully", saved));
    } catch (err: any) {
        res.status(500).json(errorResponse(err.message || "Failed to send message"));
    }
};

/**
 * POST /api/chat/read/:messageId
 * Mark a message as read
 */
export const markRead = async (
    req: any,
    res: Response
) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.user?.userId;

        if (!messageId) {
            return res.status(400).json(errorResponse("Message id is required"));
        }

        await markMessageRead(messageId, userId, new Date().toISOString());

        res.json(successResponse("Message marked as read"));
    } catch (err: any) {
        res.status(500).json(errorResponse(err.message || "Failed to mark message as read"));
    }
};