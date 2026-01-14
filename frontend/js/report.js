import { Store } from "../../services/store.js";
import { createChart, showStateMessage } from "./components.js";
import { CONFIG } from "../../config/constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const chartsContainer = document.querySelector(".charts-container");
  const stateContainer = document.getElementById("charts-state");

  if (!chartsContainer || !stateContainer) {
    console.error("Containers du dashboard introuvables");
    return;
  }

  let chartsInitialized = false;

  Store.subscribe((state) => {
    stateContainer.innerHTML = "";

    if (state.isLoading) {
      showStateMessage(stateContainer, "loading");
      return;
    }

    if (state.statsError) {
      showStateMessage(stateContainer, "error", state.statsError);

      const retry = document.createElement("button");
      retry.textContent = "Réessayer";
      retry.onclick = () => Store.loadTodayStats();
      stateContainer.appendChild(retry);
      return;
    }

    const { sugar, caffeine, calories } = state.todayStats;

    // Initialisation des charts
    if (!chartsInitialized) {
      createChart({
        canvasId: "sugarChart",
        label: "Sucre",
        current: sugar,
        max: CONFIG.HEALTH_LIMITS.SUGAR_MAX,
        unit: "g",
        color: "#FF6384",
      });

      createChart({
        canvasId: "caffeineChart",
        label: "Caféine",
        current: caffeine,
        max: CONFIG.HEALTH_LIMITS.CAFFEINE_MAX,
        unit: "mg",
        color: "#36A2EB",
      });

      createChart({
        canvasId: "caloriesChart",
        label: "Calories",
        current: calories,
        max: 2000,
        unit: "kcal",
        color: "#FFCE56",
      });

      chartsInitialized = true;
    }
  });

  // Chargement initial
  Store.loadTodayStats();

  // Rafraîchissement automatique toutes les 30 secondes
  setInterval(() => Store.loadTodayStats(), 30000);
});