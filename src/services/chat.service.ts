// src/services/chat.service.ts

import { db } from "../config/db";
import { v4 as uuid } from "uuid";

export interface ChatMessage {
    messageId: string;
    roomId: string;
    senderId: string;
    senderName: string;
    messageText: string;
    messageType: "text" | "image" | "file";
    isEdited: boolean;
    isDeleted: boolean;
    createdAt?: number;
    updatedAt?: number;
}

export interface ChatRoom {
    roomId: string;
    roomName?: string;
    roomType: "private" | "group";
    createdBy: string;
    createdAt?: number;
    updatedAt?: number;
}

/**
 * Save new message into DB
 */
export const saveMessage = async (
    roomId: string,
    senderId: string,
    senderName: string,
    messageText: string,
    now: number
): Promise<ChatMessage> => {
    if (!roomId || !senderId || !messageText.trim()) {
        throw new Error("Missing required fields");
    }

    const messageId = uuid();
    await db.execute(
        `
    INSERT INTO chat_messages
    (messageId, roomId, senderId, messageText, senderName, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [messageId, roomId, senderId, messageText, now, now]
    );

    return {
        messageId,
        roomId,
        senderId,
        senderName,
        messageText,
        messageType: "text",
        isEdited: false,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
    };
};

/**
 * Get chat history by room
 */
export const getMessagesByRoom = async (
    roomId: string,
    limit: number = 50
) => {
    const [rows]: any = await db.execute(
        `
    SELECT
      messageId,
      roomId,
      senderId,
      messageText,
      messageType,
      isEdited,
      isDeleted,
      createdAt,
      updatedAt
    FROM chat_messages
    WHERE roomId = ?
    ORDER BY createdAt ASC
    LIMIT ?
    `,
        [roomId, limit]
    );

    return rows;
};

/**
 * Create a chat room owned by a user
 */
export const createChatRoom = async (
    roomName: string,
    roomType: "private" | "group",
    createdBy: string,
    now: number
): Promise<ChatRoom> => {
    if (!roomName || !roomType || !createdBy) {
        throw new Error("Missing required fields");
    }

    const roomId = uuid();
    await db.execute(
        `
    INSERT INTO chat_rooms
    (roomId, roomName, roomType, createdBy, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
        [roomId, roomName, roomType, createdBy, now, now]
    );

    return {
        roomId,
        roomName,
        roomType,
        createdBy,
        createdAt: now,
        updatedAt: now,
    };
};

/**
 * Get rooms belonging to a user
 */
export const getMyRoomsByUser = async (createdBy: string) => {
    const [rows]: any = await db.execute(
        `
    SELECT
      roomId,
      roomName,
      roomType,
      createdBy,
      createdAt,
      updatedAt
    FROM chat_rooms
    WHERE createdBy = ?
    ORDER BY createdAt DESC
    `,
        [createdBy]
    );

    return rows;
};

/**
 * Mark a message as read
 */
export const markMessageRead = async (
    messageId: string,
    userId: string,
    now: string
) => {
    const readId = uuid();

    await db.execute(
        `
    INSERT INTO message_reads
    (readId, messageId, userId, readAt, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      readAt = VALUES(readAt),
      updatedAt = VALUES(updatedAt)
    `,
        [readId, messageId, userId, now, now, now]
    );

    return true;
};

/**
 * Delete single message (owner/admin logic can be added later)
 */
export const deleteMessageById = async (messageId: string) => {
    const [result]: any = await db.execute(
        `
    DELETE FROM chat_messages
    WHERE messageId = ?
    `,
        [messageId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Message not found");
    }

    return true;
};