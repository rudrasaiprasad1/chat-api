import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { login, register, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

export default router;