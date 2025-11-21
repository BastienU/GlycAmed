import { Router, Request, Response } from "express";
import { productService } from "../services/product.service";

const router = Router();

/**
 * GET /products/barcode/:barcode
 * Recherche un produit par code-barres
 */
router.get("/barcode/:barcode", async (req: Request, res: Response) => {
  const { barcode } = req.params;

  if (!barcode) return res.status(400).json({ message: "Missing barcode parameter" });

  try {
    const product = await productService.lookupByBarcode(barcode);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

/**
 * GET /products/search
 * Recherche des produits par nom
 * Query parameters: ?q=nom&page=1&pageSize=10
 */
router.get("/search", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = parseInt((req.query.pageSize as string) || "10", 10);

  if (!q) return res.status(400).json({ message: "Missing search query 'q'" });

  try {
    const products = await productService.searchByName(q, page, pageSize);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
