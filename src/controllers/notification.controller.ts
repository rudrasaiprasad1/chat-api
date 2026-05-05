import { Request, Response } from "express";
import { sendPushNotification } from "../services/notification.service";
import { successResponse, errorResponse } from "../utils/response";

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { token, title, body } = req.body;

    const result = await sendPushNotification(token, title, body);

    res.json(successResponse("Notification sent successfully", result));
  } catch (error: any) {
    res.status(500).json(errorResponse(error.message));
  }
};