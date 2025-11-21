interface NutrientInfo {
  sugarsPer100ml?: number;
  caffeinePer100ml?: number;
  caloriesPer100ml?: number;
}

export const calculateNutrients = (quantity: number, nutrients: NutrientInfo) => {
  const sugar = ((nutrients.sugarsPer100ml ?? 0) * quantity) / 100;
  const caffeine = ((nutrients.caffeinePer100ml ?? 0) * quantity) / 100;
  const calories = ((nutrients.caloriesPer100ml ?? 0) * quantity) / 100;

  return { sugar, caffeine, calories };
};


