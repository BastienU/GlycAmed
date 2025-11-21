export interface ProductInfo {
  barcode: string;
  name: string;
  brand: string;
  image: string | null;

  sugarsPer100ml: number;
  caffeinePer100ml: number;
  caloriesPer100ml: number;
}
