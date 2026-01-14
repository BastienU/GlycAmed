import { CONFIG } from "../config/constants.js";
import { Store } from "./store.js";
import { AlertManager } from "../frontend/js/components.js";

export const ApiService = {
  async request(endpoint, options = {}) {
    const token = Store.getToken();

    const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
    }

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Erreur API (${response.status})`;

      AlertManager.error(message);
      throw new Error(message);
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  },
};