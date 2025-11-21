// product.dto.ts
export interface ProductInfo {
  barcode?: string;
  productName: string;
  brands?: string;
  imageUrl?: string;
  // values per 100ml (or per 100g approximated)
  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;
  // raw nutriments object from OFF (kept minimal)
  nutriments?: Record<string, unknown>;
}
