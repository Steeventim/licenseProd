import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
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

export const adminAPI = {
  // Clients
  async getClients(page = 1, limit = 10) {
    return await apiClient.get(`/clients?page=${page}&limit=${limit}`);
  },

  async createClient(clientData) {
    return await apiClient.post("/clients", clientData);
  },

  async updateClient(clientId, clientData) {
    return await apiClient.put(`/clients/${clientId}`, clientData);
  },

  async deleteClient(clientId) {
    return await apiClient.delete(`/clients/${clientId}`);
  },

  // Licences
  async getLicenses(page = 1, limit = 10, status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    return await apiClient.get(`/licenses?${params.toString()}`);
  },

  async createLicense(licenseData) {
    return await apiClient.post("/licenses", licenseData);
  },

  async getLicenseDetails(licenseId) {
    return await apiClient.get(`/licenses/${licenseId}`);
  },

  // Mettre à jour une licence (admin)
  async updateLicense(licenseId, updateData) {
    try {
      const response = await apiClient.put(
        `/licenses/${licenseId}`,
        updateData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Révoquer une licence (admin)
  async revokeLicense(licenseKey) {
    try {
      const response = await apiClient.post("/licenses/revoke", {
        licenseKey,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une licence (admin)
  async deleteLicense(licenseId) {
    try {
      const response = await apiClient.delete(`/licenses/${licenseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Statistiques (à implémenter côté backend)
  async getStats() {
    try {
      // Simuler des statistiques pour l'instant
      const [clients, licenses] = await Promise.all([
        this.getClients(1, 1000),
        this.getLicenses(1, 1000),
      ]);

      const stats = {
        totalClients: clients.pagination?.total || 0,
        totalLicenses: licenses.pagination?.total || 0,
        activeLicenses:
          licenses.licenses?.filter((l) => l.status === "ACTIVE").length || 0,
        expiredLicenses:
          licenses.licenses?.filter((l) => l.status === "EXPIRED").length || 0,
        suspendedLicenses:
          licenses.licenses?.filter((l) => l.status === "SUSPENDED").length ||
          0,
        revokedLicenses:
          licenses.licenses?.filter((l) => l.status === "REVOKED").length || 0,
      };

      return stats;
    } catch (error) {
      console.error("Erreur récupération stats:", error);
      return {
        totalClients: 0,
        totalLicenses: 0,
        activeLicenses: 0,
        expiredLicenses: 0,
        suspendedLicenses: 0,
        revokedLicenses: 0,
      };
    }
  },
};
