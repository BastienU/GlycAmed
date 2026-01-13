import { ApiService } from "../../services/api.js";
import { formatDate, showStateMessage, createTableRow } from "./components.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("recent-consumptions-body");

    try {
        const consumptions = await ApiService.get("/consumption/all");

        if (!Array.isArray(consumptions) || consumptions.length === 0) {
            showStateMessage(tbody.parentElement, 'empty');
            return;
        }

        tbody.innerHTML = "";

        consumptions.forEach(cons => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${cons.productName || cons.barcode || "Inconnu"}</td>
                <td>${cons.quantityMl} ml</td>
                <td>${formatDate(cons.consumedAt)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erreur récupération consommations :", error);
        showStateMessage(tbody.parentElement, 'error');
    }
});