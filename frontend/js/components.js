/**
 * Composants UI réutilisables
 * Centralise la logique commune pour éviter la duplication
 */

/**
 * Formate une date au format français
 * @param {Date|string} date - Date à formater
 * @returns {string} "14/11/2025 : 09:15"
 */
export function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const formattedDate = date.toLocaleDateString("fr-FR");
  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
  
  return `${formattedDate} : ${formattedTime}`;
}

/**
 * Crée et rend une jauge de progression (gauge)
 * @param {Object} options
 * @param {HTMLElement} options.container - Élément parent
 * @param {string} options.label - Libellé (ex: "Sucre")
 * @param {number} options.value - Valeur actuelle
 * @param {number} options.max - Valeur maximale
 * @param {string} options.unit - Unité (g, mg, kcal)
 * @param {string} options.color - Couleur hex (#FF6384)
 * @returns {Object} Objet avec méthode update(newValue)
 */
export function createGauge({ container, label, value, max, unit, color = '#FF6384' }) {
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }

  const percentage = Math.min((value / max) * 100, 100);
  const isWarning = percentage > 80;
  const isDanger = percentage > 100;

  const gaugeHTML = `
    <div class="gauge" style="--gauge-percentage: ${percentage}%; --gauge-color: ${color};">
      <div class="gauge-label">${label}</div>
      <div class="gauge-track">
        <div class="gauge-fill"></div>
      </div>
      <div class="gauge-info">
        <span class="gauge-value">${value}${unit}</span>
        <span class="gauge-max">/ ${max}${unit}</span>
      </div>
      <div class="gauge-status ${isDanger ? 'danger' : isWarning ? 'warning' : 'ok'}">
        ${isDanger ? 'Dépassé' : isWarning ? 'Attention' : 'OK'}
      </div>
    </div>
  `;

  container.innerHTML = gaugeHTML;

  // Retourner une fonction pour mettre à jour la jauge
  return {
    update(newValue) {
      const newPercentage = Math.min((newValue / max) * 100, 100);
      const newIsDanger = newPercentage > 100;
      const newIsWarning = newPercentage > 80;

      const gaugeEl = container.querySelector('.gauge');
      gaugeEl.style.setProperty('--gauge-percentage', `${newPercentage}%`);
      
      const valueEl = container.querySelector('.gauge-value');
      valueEl.textContent = `${newValue}${unit}`;
      
      const statusEl = container.querySelector('.gauge-status');
      statusEl.className = `gauge-status ${newIsDanger ? 'danger' : newIsWarning ? 'warning' : 'ok'}`;
      statusEl.innerHTML = newIsDanger ? 'Dépassé' : newIsWarning ? 'Attention' : 'OK';
    },
    
    get value() {
      return value;
    }
  };
}

/**
 * Crée un chart doughnut pour afficher une métrique
 * @param {Object} options
 * @param {string} options.canvasId - ID du canvas
 * @param {string} options.label - Libellé
 * @param {number} options.current - Valeur actuelle
 * @param {number} options.max - Valeur maximale
 * @param {string} options.unit - Unité
 * @param {string} options.color - Couleur du chart
 * @returns {Chart} Instance Chart.js
 */
export function createChart({ canvasId, label, current, max, unit, color }) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas avec l'ID "${canvasId}" non trouvé`);
    return null;
  }

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: [`${label} consommé`, 'Restant'],
      datasets: [{
        data: [current, Math.max(max - current, 0)],
        backgroundColor: [color, '#E0E0E0'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: { 
          display: true, 
          text: `${label} : ${current}${unit} / ${max}${unit}` 
        },
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

/**
 * Affiche un message d'état (vide, erreur, loading)
 * @param {HTMLElement} container - Élément parent
 * @param {string} state - 'empty' | 'error' | 'loading'
 * @param {string} message - Message personnalisé
 */
export function showStateMessage(container, state, message = '') {
  const messages = {
    empty: message || 'Aucune donnée disponible.',
    error: message || 'Erreur lors du chargement des données.',
    loading: message || 'Chargement en cours...'
  };

  container.innerHTML = `
    <div class="state-message state-${state}">
      <p>${messages[state]}</p>
    </div>
  `;
}

/**
 * Crée une ligne de tableau (row)
 * @param {Object} data - Données pour la ligne
 * @param {Array<string>} columns - Clés à afficher
 * @returns {HTMLTableRowElement}
 */
export function createTableRow(data, columns) {
  const tr = document.createElement('tr');
  
  columns.forEach(column => {
    const td = document.createElement('td');
    td.textContent = data[column] ?? '—';
    tr.appendChild(td);
  });

  return tr;
}

/**
 * Classe pour gérer les alertes (succès/erreur)
 */
export class AlertManager {
  static show(type, message, duration = 4000, containerId = null) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    const parent = containerId 
      ? document.getElementById(containerId)
      : document.body;

    parent.prepend(alert);

    setTimeout(() => alert.remove(), duration);
  }

  static success(message, duration = 4000) {
    this.show('success', message, duration);
  }

  static error(message, duration = 4000) {
    this.show('error', message, duration);
  }

  static warning(message, duration = 4000) {
    this.show('warning', message, duration);
  }

  static info(message, duration = 4000) {
    this.show('info', message, duration);
  }
}
