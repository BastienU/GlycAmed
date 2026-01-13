import { Router } from "express";
import { ProductService } from "../services/product.service";

const router = Router();
const service = new ProductService();

router.get("/search", async (req, res) => {
    try {
    const name = req.query.name as string;
    if (!name) return res.status(400).json({ message: "Missing name" });

    const products = await service.getProducts(name);
    res.json(products);

  } catch (err) {
    res.status(500).json({ message: "OpenFoodFacts error", error: err });
  }
});

export default router;