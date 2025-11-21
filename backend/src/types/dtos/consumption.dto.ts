export interface CreateConsumptionDTO {
  productName: string;
  brand?: string;
  quantity: number; // en ml ou g
  sugar?: number;   // grammes
  caffeine?: number; // mg
  calories?: number; // kcal
  location?: string;
  note?: string;
  consumedAt?: Date;
}

export interface UpdateConsumptionDTO {
  quantity?: number;
  sugar?: number;
  caffeine?: number;
  calories?: number;
  location?: string;
  note?: string;
  consumedAt?: Date;
}
