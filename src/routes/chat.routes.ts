import { Router } from "express";
import {
    getChatHistory,
    getMyRooms,
    createRoom,
    sendMessage,
    markRead,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/rooms/my", authenticate, getMyRooms);
router.post("/rooms", authenticate, createRoom);
router.post("/send", authenticate, sendMessage);
router.post("/read/:messageId", authenticate, markRead);
router.get("/:roomId", authenticate, getChatHistory);

export default router;