import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { errorResponse } from "../utils/response";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json(errorResponse("Unauthorized"));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json(errorResponse("Invalid token"));
  }
};