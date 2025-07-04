import axios from 'axios';

// Configuration de base pour les appels API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Erreur réseau';
    return Promise.reject(new Error(message));
  }
);

export const licenseAPI = {
  // Valider une licence
  async validateLicense(licenseKey, options = {}) {
    try {
      const response = await apiClient.post('/licenses/validate', {
        domain: options.domain,
      }, {
        headers: {
          Authorization: `Bearer ${licenseKey}`,
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Ping d'utilisation
  async pingLicense(licenseKey) {
    try {
      const response = await apiClient.post('/licenses/ping', {}, {
        headers: {
          Authorization: `Bearer ${licenseKey}`,
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les détails d'une licence
  async getLicenseDetails(licenseId) {
    try {
      const response = await apiClient.get(`/licenses/${licenseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Créer une nouvelle licence (admin)
  async createLicense(licenseData) {
    try {
      const response = await apiClient.post('/licenses', licenseData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Révoquer une licence (admin)
  async revokeLicense(licenseKey) {
    try {
      const response = await apiClient.post('/licenses/revoke', {
        licenseKey,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lister toutes les licences (admin)
  async getAllLicenses(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.status) params.append('status', options.status);
      
      const response = await apiClient.get(`/licenses?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const clientAPI = {
  // Créer un nouveau client
  async createClient(clientData) {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lister tous les clients
  async getAllClients(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      
      const response = await apiClient.get(`/clients?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les détails d'un client
  async getClientDetails(clientId) {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Modifier un client
  async updateClient(clientId, clientData) {
    try {
      const response = await apiClient.put(`/clients/${clientId}`, clientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un client
  async deleteClient(clientId) {
    try {
      const response = await apiClient.delete(`/clients/${clientId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
