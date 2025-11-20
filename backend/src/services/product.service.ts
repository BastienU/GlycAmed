import fetch from "node-fetch";

export class ProductService {
  async getProducts(query: string = "energy drink") {
    const url =
      `https://world.openfoodfacts.org/cgi/search.pl?` +
      `search_terms=${encodeURIComponent(query)}` +
      `&search_simple=1` +
      `&action=process` +
      `&json=1` +
      `&page_size=50` +
      `&fields=product_name,code,nutriments`;

    const response = await fetch(url);
    const data = await response.json();

    return data.products
      .filter((p: any) => p.product_name && p.code)
      .map((p: any) => ({
        name: p.product_name,
        barcode: p.code,
        nutrients: {
          sugar: p.nutriments?.sugars_100g || 0,
          caffeine: p.nutriments?.caffeine_100g || 0,
          calories: p.nutriments?.energy_kcal_100g || 0,
        },
      }));
  }
}