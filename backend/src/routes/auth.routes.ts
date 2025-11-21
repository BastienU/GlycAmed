import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new AuthController();

// Routes publiques
router.post("/register", (req, res) => controller.register(req, res));
router.post("/login", (req, res) => controller.login(req, res));

// Route protégée
router.get("/profile", authMiddleware, (req, res) => controller.profile(req, res));

export default router;
