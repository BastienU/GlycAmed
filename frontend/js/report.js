import { CONFIG } from "../../config/constants.js";
import { ApiService } from "../../services/api.js";
import { createChart } from "./components.js";

async function renderCharts() {
    // Appel API pour récupérer les consommations du jour
    const consumptions = await ApiService.get("/consumption/all");

    let totalSugar = 0, totalCaffeine = 0, totalCalories = 0;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    consumptions.forEach(c => {
        const consumedDate = new Date(c.consumedAt).toISOString().split("T")[0];
        if (consumedDate === today) {
            totalSugar += c.nutrients.sugar || 0;
            totalCaffeine += c.nutrients.caffeine || 0;
            totalCalories += c.nutrients.calories || 0;
        }
    });

    const sugarMax = CONFIG.HEALTH_LIMITS.SUGAR_MAX;
    createChart({
        canvasId: 'sugarChart',
        label: 'Sucre',
        current: totalSugar,
        max: sugarMax,
        unit: 'g',
        color: '#FF6384'
    });

    const caffeineMax = CONFIG.HEALTH_LIMITS.CAFFEINE_MAX;
    createChart({
        canvasId: 'caffeineChart',
        label: 'Caféine',
        current: totalCaffeine,
        max: caffeineMax,
        unit: 'mg',
        color: '#36A2EB'
    });

    createChart({
        canvasId: 'caloriesChart',
        label: 'Calories',
        current: totalCalories,
        max: 2000,
        unit: 'kcal',
        color: '#FFCE56'
    });
}

renderCharts();