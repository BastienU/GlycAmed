import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export class ProductController {
  static async getByBarcode(req: Request, res: Response) {
    try {
      const barcode = req.params.barcode;
      if (!barcode) {
        return res.status(400).json({ message: "Paramètre 'barcode' requis" });
      }

      const product = await productService.fetchProductByBarcode(barcode);
      if (!product) return res.status(404).json({ message: "Produit non trouvé" });

      res.json(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erreur inconnue" });
      }
    }
  }

  static async searchByName(req: Request, res: Response) {
    try {
      const name = req.query.name;
      if (!name || typeof name !== "string") {
        return res.status(400).json({ message: "Paramètre 'name' requis et doit être une chaîne" });
      }

      const products = await productService.searchProductsByName(name);
      res.json(products);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erreur inconnue" });
      }
    }
  }
}
