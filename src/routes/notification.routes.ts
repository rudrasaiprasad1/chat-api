import { Router } from "express";
import { sendNotification } from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/send", authenticate, sendNotification);

export default router;