import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/barcode/:barcode", authMiddleware, ProductController.getByBarcode);

router.get("/search", authMiddleware, ProductController.searchByName);

export default router;

