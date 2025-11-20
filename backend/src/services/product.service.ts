import { Product, IProduct } from "../models/product.model";
import { OpenFoodApiResponse } from "../types/openfood.interface";

export class ProductService {
  private readonly API_URL = "https://world.openfoodfacts.org/api/v0/product";

  // Recherche via barcode
  async fetchProductByBarcode(barcode: string): Promise<IProduct | null> {
    const res = await fetch(`${this.API_URL}/${barcode}.json`);
    if (!res.ok) throw new Error("Open Food Facts API error");

    const rawData = await res.json();

    // Vérification stricte
    if (!rawData || typeof rawData !== "object" || !("product" in rawData)) {
      throw new Error("Invalid API response");
    }

    const data: OpenFoodApiResponse = rawData as OpenFoodApiResponse;

    if (!data.product) return null;

    const nutriments = {
      sugar: Number(data.product.nutriments?.sugars_100g || 0),
      caffeine: Number(data.product.nutriments?.caffeine_100g || 0),
      calories: Number(data.product.nutriments?.energy_kcal_100g || 0),
    };

    const productData: IProduct = {
      barcode,
      name: data.product.product_name || "Unknown",
      brand: data.product.brands || "Unknown",
      imageUrl: data.product.image_front_url, // optionnel, OK pour TS strict
      nutriments,
    };

    // Sauvegarde en base si n'existe pas déjà
    const existing = await Product.findOne({ barcode });
    if (existing) return existing;

    const product = new Product(productData);
    return product.save();
  }

  // Recherche produit par nom
  async searchProductsByName(name: string): Promise<IProduct[]> {
    const regex = new RegExp(name, "i");
    return Product.find({ name: regex }).limit(20);
  }
}
