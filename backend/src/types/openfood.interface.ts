export interface OpenFoodProduct {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  nutriments?: {
    sugars_100g?: number;
    caffeine_100g?: number;
    energy_kcal_100g?: number;
  };
}

export interface OpenFoodApiResponse {
  product?: OpenFoodProduct;
}
