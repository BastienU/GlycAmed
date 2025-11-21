import { ProductInfo } from "../types/product-info.type";
import {
  OpenFoodFactsProduct,
  OpenFoodFactsProductResponse,
  OpenFoodFactsSearchResponse,
} from "../types/off-api-response.type";

export class ProductService {
  private BASE = "https://world.openfoodfacts.org";

  // ╔══════════════════════════════════════╗
  // ║ 1. Recherche par code-barres         ║
  // ╚══════════════════════════════════════╝
  async lookupByBarcode(barcode: string): Promise<ProductInfo | null> {
    const url = `${this.BASE}/api/v0/product/${encodeURIComponent(barcode)}.json`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenFoodFacts API error: ${res.status}`);

    // res.json() retourne `unknown` → cast safe
    const json = (await res.json()) as Partial<OpenFoodFactsProductResponse>;

    if (!json || json.status !== 1 || !json.product) {
      return null;
    }

    return this.parseOFFProduct(json.product, barcode);
  }

  // ╔══════════════════════════════════════╗
  // ║ 2. Recherche par nom                 ║
  // ╚══════════════════════════════════════╝
  async searchByName(
    query: string,
    page = 1,
    pageSize = 10
  ): Promise<ProductInfo[]> {
    const url =
      `${this.BASE}/cgi/search.pl?search_terms=` +
      `${encodeURIComponent(query)}&search_simple=1&action=process&json=1` +
      `&page=${page}&page_size=${pageSize}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenFoodFacts API error: ${res.status}`);

    // retour inconnu → cast
    const json = (await res.json()) as Partial<OpenFoodFactsSearchResponse>;

    const items = json.products;
    if (!Array.isArray(items)) return [];

    return items
      .map((p) => this.parseOFFProduct(p, p.code))
      .filter((p): p is ProductInfo => p !== null);
  }

  // ╔══════════════════════════════════════╗
  // ║ 3. Parsing des données OFF           ║
  // ╚══════════════════════════════════════╝
  private parseOFFProduct(
    product: OpenFoodFactsProduct | undefined,
    barcode: string
  ): ProductInfo | null {
    if (!product) return null;

    const nutrients = product.nutriments ?? {};

    return {
      barcode,
      name: product.product_name ?? "Produit inconnu",
      brand: product.brands ?? "Marque inconnue",
      image: product.image_small_url ?? product.image_url ?? null,

      sugarsPer100ml: nutrients.sugars_100ml ?? nutrients.sugars_100g ?? 0,
      caffeinePer100ml: nutrients["caffeine_100ml"] ?? 0,
      caloriesPer100ml: nutrients.energy_kcal_100ml ?? nutrients.energy_kcal_100g ?? 0,
    };
  }
}

export const productService = new ProductService();

