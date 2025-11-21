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

    const json = (await res.json()) as Partial<OpenFoodFactsProductResponse>;

    if (!json || json.status !== 1 || !json.product) return null;

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
    barcode: string | undefined
  ): ProductInfo | null {
    if (!product) return null;

    const nutriments = product.nutriments ?? {};

    const info: ProductInfo = {
      productName: product.product_name ?? "Produit inconnu",
      brands: product.brands ?? "Marque inconnue",
      sugarsPer100ml: nutriments.sugars_100ml ?? nutriments.sugars_100g ?? 0,
      caffeinePer100ml: nutriments.caffeine_100ml ?? 0,
      caloriesPer100ml: nutriments.energy_kcal_100ml ?? nutriments.energy_kcal_100g ?? 0,
      nutriments,
    };

    if (barcode) info.barcode = barcode;

    const imageUrl = product.image_small_url ?? product.image_url;
    if (imageUrl) info.imageUrl = imageUrl;

    return info;
  }
}

export const productService = new ProductService();
