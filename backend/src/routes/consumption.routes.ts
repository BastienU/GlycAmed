import { Router } from "express";
import { ConsumptionController } from "../controllers/consumption.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ConsumptionController();

// Toutes les routes protégées par JWT
router.use(authMiddleware);

// CRUD Consommations
router.post("/", (req, res) => controller.create(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

// Création depuis OFF
router.post("/from-barcode", (req, res) => controller.createFromBarcode(req, res));

export default router;
