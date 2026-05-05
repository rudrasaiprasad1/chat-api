import { Router } from "express";
import { saveToken, getCurrentUser } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// 🔐 Protected routes
router.get("/me", authenticate, getCurrentUser);
router.post("/fcm-token", authenticate, saveToken);

export default router;