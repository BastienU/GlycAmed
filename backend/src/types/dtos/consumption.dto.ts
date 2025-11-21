export interface CreateConsumptionDTO {
  productName: string;
  brand?: string;
  quantity: number; // en ml ou g
  location?: string;
  note?: string;

  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;

  consumedAt?: Date; // facultatif, sinon Date.now()
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

  sugar?: number;
  caffeine?: number;
  calories?: number;

  consumedAt?: Date;
}
