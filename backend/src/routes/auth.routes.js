import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/me", requireAuth, AuthController.me);

export default router;
