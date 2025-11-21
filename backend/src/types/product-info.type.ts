export interface ProductInfo {
  barcode?: string;        
  productName: string;
  brands?: string;
  imageUrl?: string;
  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;
  nutriments?: Record<string, unknown>;
}
