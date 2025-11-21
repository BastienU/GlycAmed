import { Router } from "express";
import { ConsumptionController } from "../controllers/consumption.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ConsumptionController();

router.use(authMiddleware);

router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
