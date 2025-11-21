export interface NutrientInfo {
  sugarsPer100ml?: number | undefined;
  caffeinePer100ml?: number | undefined;
  caloriesPer100ml?: number | undefined;
}

export function calculateNutrients(quantity: number, info: NutrientInfo) {
  const sugar = info.sugarsPer100ml ? (info.sugarsPer100ml * quantity) / 100 : 0;
  const caffeine = info.caffeinePer100ml ? (info.caffeinePer100ml * quantity) / 100 : 0;
  const calories = info.caloriesPer100ml ? (info.caloriesPer100ml * quantity) / 100 : 0;

  return { sugar, caffeine, calories };
}
