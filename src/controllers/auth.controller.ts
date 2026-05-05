import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { clearFCMToken } from "../services/user.service";
import { v4 as uuid } from "uuid";
import { successResponse, errorResponse } from "../utils/response";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, createdAt } = req.body;
    const userId = uuid();

    const result = await registerUser(userId, email, password, createdAt);

    res.status(201).json(successResponse("User registered successfully", result));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(successResponse("Login successful", result));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};

export const logout = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json(errorResponse("User id is required"));
    }

    await clearFCMToken(userId);

    res.json(successResponse("Logout successful"));
  } catch (err: any) {
    res.status(500).json(errorResponse(err.message));
  }
};