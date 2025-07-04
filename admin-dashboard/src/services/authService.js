import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses et erreurs
authAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Erreur réseau";

    // Si le token est invalide/expiré, nettoyer le localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.reload(); // Forcer la reconnexion
    }

    return Promise.reject(new Error(message));
  }
);

export const authService = {
  // Connexion
  async login(credentials) {
    try {
      const response = await authAPI.post("/login", credentials);

      if (response.success && response.token) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem("admin_token", response.token);
        localStorage.setItem("admin_user", JSON.stringify(response.user));

        return response;
      } else {
        throw new Error("Réponse de connexion invalide");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  },

  // Déconnexion
  async logout() {
    try {
      await authAPI.post("/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Nettoyer le localStorage même en cas d'erreur
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
  },

  // Vérification du token
  async verifyToken() {
    try {
      const response = await authAPI.get("/verify");

      if (response.success && response.user) {
        // Mettre à jour les infos utilisateur
        localStorage.setItem("admin_user", JSON.stringify(response.user));
        return response.user;
      } else {
        throw new Error("Token invalide");
      }
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      this.logout(); // Nettoyer en cas d'erreur
      throw error;
    }
  },

  // Récupérer les infos utilisateur depuis le localStorage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("admin_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      return null;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem("admin_token");
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Récupérer le token
  getToken() {
    return localStorage.getItem("admin_token");
  },
};
