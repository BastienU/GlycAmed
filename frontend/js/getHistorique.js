import { ApiService } from "../../services/api.js";
import { formatDate, showStateMessage } from "./components.js";

const tableBody = document.getElementById("recent-consumptions-body");

async function loadHistory() {
    try {
        const consumptions = await ApiService.get("/consumption/all");

        tableBody.innerHTML = "";

        if (!Array.isArray(consumptions) || consumptions.length === 0) {
            showStateMessage(tableBody.parentElement, 'empty');
            return;
        }

        consumptions
            .sort((a, b) => new Date(b.consumedAt) - new Date(a.consumedAt))
            .forEach(consumption => {
                const nutrients = consumption.nutrients
                    ? `Caféine: ${consumption.nutrients.caffeine}mg, Sucre: ${consumption.nutrients.sugar}g, Calories: ${consumption.nutrients.calories}kcal`
                    : "—";

                const contributorEmail =
                    consumption.contributorId?.email ||
                    consumption.contributorId?.username ||
                    "—";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${consumption.productName || "—"}</td>
                    <td>${consumption.quantityMl} ml</td>
                    <td>${nutrients}</td>
                    <td>${formatDate(consumption.consumedAt)}</td>
                    <td>${contributorEmail}</td>
                `;

                tableBody.appendChild(tr);
            });

    } catch (error) {
        console.error("Erreur chargement historique :", error);
        showStateMessage(tableBody.parentElement, 'error');
    }
}

loadHistory();