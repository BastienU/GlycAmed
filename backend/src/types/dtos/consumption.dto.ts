export interface CreateConsumptionDTO {
  productName: string;
  brand?: string;
  quantity: number;
  location?: string;
  note?: string;

  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;
}

export interface UpdateConsumptionDTO {
  productName?: string;
  brand?: string;
  quantity?: number;
  location?: string;
  note?: string;

  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;

  // Ajout des nutriments calculés
  sugar?: number;
  caffeine?: number;
  calories?: number;
}
