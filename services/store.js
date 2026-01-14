import { ApiService } from "./api.js";

/**
 * Store centralisé - Pattern Observer
 * Source unique de vérité pour l'état partagé (authentification, stats, etc.)
 */

const Store = {
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
    todayStats: {
      sugar: 0,
      caffeine: 0,
      calories: 0,
    },
    isLoading: false,
    statsError: null,
  },

  listeners: [],

  /**
   * Met à jour l'état et notifie les listeners
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  },

  /**
   * S'abonne aux changements d'état
   * Retourne une fonction de désabonnement
   */
  subscribe(fn) {
    this.listeners.push(fn);
    // Appel immédiat avec l'état courant
    fn(this.state);
    // Retourner une fonction de désabonnement
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },

  /**
   * Notifie tous les listeners des changements
   */
  notify() {
    this.listeners.forEach(fn => fn(this.state));
  },

  /**
   * Initialise le store depuis localStorage
   */
  init() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        this.setState({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Erreur lors du parsing du user:", error);
        this.clear();
      }
    }
  },

  /**
   * Connecte un utilisateur
   */
  login(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    this.setState({
      token,
      user,
      isAuthenticated: true,
    });
  },

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      token: null,
      user: null,
      isAuthenticated: false,
      todayStats: { sugar: 0, caffeine: 0 },
    });
  },

  /**
   * Efface complètement l'état et le stockage
   */
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      todayStats: { sugar: 0, caffeine: 0 },
      isLoading: false,
    });
  },

  /**
   * Met à jour les stats du jour
   */
  setTodayStats(stats) {
    this.setState({
      todayStats: { ...this.state.todayStats, ...stats },
    });
  },

  /**
   * Charge les stats de consommation du jour depuis l'API
   */
  async loadTodayStats() {
    this.setState({ isLoading: true, statsError: null });

    try {
      const data = await ApiService.get("/consumption/all");

      const today = new Date().toISOString().split("T")[0];

      const stats = data
        .filter(c => c.consumedAt?.startsWith(today))
        .reduce(
          (acc, c) => {
            acc.sugar += c.nutrients?.sugar || 0;
            acc.caffeine += c.nutrients?.caffeine || 0;
            acc.calories += c.nutrients?.calories || 0;
            return acc;
          },
          { sugar: 0, caffeine: 0, calories: 0 }
        );

      this.setState({ todayStats: stats });

    } catch (err) {
      this.setState({ statsError: err.message });
    } finally {
      this.setState({ isLoading: false });
    }
  },

  /**
   * Définit l'état de chargement
   */
  setLoading(isLoading) {
    this.setState({ isLoading });
  },

  /**
   * Récupère l'état courant
   */
  getState() {
    return { ...this.state };
  },

  /**
   * Récupère le token
   */
  getToken() {
    return this.state.token;
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isUserAuthenticated() {
    return this.state.isAuthenticated;
  },

  /**
   * Récupère l'utilisateur courant
   */
  getUser() {
    return this.state.user;
  },
};

// Initialiser le store au chargement
Store.init();

export { Store };
