// Service pour récupérer automatiquement la licence de test
import { licenseAPI } from './licenseAPI';

export const testLicenseService = {
  // Récupérer la dernière licence de test active
  async getActiveTestLicense() {
    try {
      // Appel à un endpoint spécial pour récupérer la licence de test
      const response = await fetch(`${import.meta.env.VITE_API_URL}/licenses/test-license`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Aucune licence de test active trouvée');
      }

      const data = await response.json();
      return data.licenseKey;
    } catch (error) {
      console.warn('Impossible de récupérer la licence de test automatique:', error.message);
      return null;
    }
  },

  // Valider si une licence de test est disponible
  async hasActiveTestLicense() {
    try {
      const licenseKey = await this.getActiveTestLicense();
      return !!licenseKey;
    } catch {
      return false;
    }
  }
};
