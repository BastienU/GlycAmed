export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  brands?: string;
  image_small_url?: string;
  image_url?: string;
  nutriments?: {
    sugars_100g?: number;
    sugars_100ml?: number;
    energy_kcal_100g?: number;
    energy_kcal_100ml?: number;
    [key: string]: number | undefined;
  };
}

export interface OpenFoodFactsProductResponse {
  status: number;
  product?: OpenFoodFactsProduct;
}

export interface OpenFoodFactsSearchResponse {
  products: OpenFoodFactsProduct[];
}
