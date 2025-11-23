import { Router, Request, Response } from "express";
import { ConsumptionService } from "../services/consumption.service";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.model";

const router = Router();
const consumptionService = new ConsumptionService();
const productService = new ProductService();

router.post("/add", async (req: Request, res: Response) => {
  try {
    const { contributorId, barcode, quantityMl, consumedAt } = req.body;

    if (!barcode || !quantityMl) {
      return res.status(400).json({ message: "barcode et quantityMl requis" });
    }

    let product = await Product.findOne({ barcode });

    if (!product) {
      const searchResults = await productService.getProducts(barcode);

      if (!searchResults || searchResults.length === 0) {
        return res
          .status(404)
          .json({ message: "Produit introuvable dans OpenFoodFacts" });
      }

      const p = searchResults[0];

      product = await Product.create({
        barcode,
        name: p.name,
        brand: "Unknown",
        nutriments: p.nutrients,
      });
    }

    const n = product.nutriments;

    const calculatedNutrients = {
      sugar: (n.sugar / 100) * quantityMl,
      caffeine: (n.caffeine / 100) * quantityMl,
      calories: (n.calories / 100) * quantityMl,
    };

    const consumption = await consumptionService.addConsumption({
      contributorId,
      product: product._id,
      quantityMl,
      consumedAt: consumedAt || new Date(),
      nutrients: calculatedNutrients,
    });

    res.status(201).json(consumption);

  } catch (err) {
    console.error("Erreur ADD consommation :", err);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la consommation",
      error: err,
    });
  }
});

router.get('/all', async (_req: Request, res: Response) => {
  try {
    const consumptions = await consumptionService.getAllConsumptions();
    res.json(consumptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des consommations', error: err });
  }
});

router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }
    const consumptions = await consumptionService.getConsumptionsByUser(userId);
    res.json(consumptions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des consommations de l\'utilisateur', error: err });
  }
});

export default router;