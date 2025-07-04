// Service de validation de licence centralisé
// Utilisable par tous les modules de l'écosystème

const axios = require('axios');

class LicenseValidationService {
  constructor(options = {}) {
    this.apiBaseUrl = options.apiBaseUrl || 'http://localhost:3001/api';
    this.licenseKey = options.licenseKey || null;
    this.domain = options.domain || 'localhost';
    this.clientId = options.clientId || null;
    
    // Cache pour éviter les validations répétées
    this.validationCache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
    
    this.apiClient = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Définir la clé de licence
   */
  setLicenseKey(licenseKey) {
    this.licenseKey = licenseKey;
    this.clearCache();
  }

  /**
   * Valider une licence avec cache
   */
  async validateLicense(features = []) {
    if (!this.licenseKey) {
      throw new Error('Aucune clé de licence configurée');
    }

    const cacheKey = `${this.licenseKey}-${features.join(',')}`;
    const cached = this.validationCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await this.apiClient.post('/licenses/validate', {
        domain: this.domain,
        requestedFeatures: features
      }, {
        headers: {
          Authorization: `Bearer ${this.licenseKey}`,
        },
      });

      // Mettre en cache le résultat
      this.validationCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      throw new Error(`Validation échouée: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Vérifier si une fonctionnalité est autorisée
   */
  async hasFeature(featureName) {
    try {
      const validation = await this.validateLicense([featureName]);
      return validation.valid && validation.license.features.includes(featureName);
    } catch (error) {
      console.error(`Erreur vérification fonctionnalité ${featureName}:`, error);
      return false;
    }
  }

  /**
   * Vérifier plusieurs fonctionnalités
   */
  async hasFeatures(featureNames) {
    try {
      const validation = await this.validateLicense(featureNames);
      if (!validation.valid) return false;
      
      return featureNames.every(feature => 
        validation.license.features.includes(feature)
      );
    } catch (error) {
      console.error('Erreur vérification fonctionnalités:', error);
      return false;
    }
  }

  /**
   * Obtenir les informations de la licence
   */
  async getLicenseInfo() {
    try {
      const validation = await this.validateLicense();
      return validation.valid ? validation.license : null;
    } catch (error) {
      console.error('Erreur récupération info licence:', error);
      return null;
    }
  }

  /**
   * Ping périodique pour maintenir la licence active
   */
  async ping() {
    if (!this.licenseKey) return false;

    try {
      await this.apiClient.post('/licenses/ping', {}, {
        headers: {
          Authorization: `Bearer ${this.licenseKey}`,
        },
      });
      return true;
    } catch (error) {
      console.error('Erreur ping licence:', error);
      return false;
    }
  }

  /**
   * Démarrer le ping automatique
   */
  startAutoPing(interval = 300000) { // 5 minutes par défaut
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      this.ping();
    }, interval);
  }

  /**
   * Arrêter le ping automatique
   */
  stopAutoPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Vider le cache
   */
  clearCache() {
    this.validationCache.clear();
  }

  /**
   * Middleware pour Express/Fastify
   */
  createMiddleware(requiredFeatures = []) {
    return async (request, reply, next) => {
      try {
        // Extraire la clé de licence des headers
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          const error = new Error('Token de licence requis');
          error.statusCode = 401;
          throw error;
        }

        const licenseKey = authHeader.substring(7);
        this.setLicenseKey(licenseKey);

        // Valider la licence
        const validation = await this.validateLicense(requiredFeatures);
        
        if (!validation.valid) {
          const error = new Error(`Licence invalide: ${validation.error}`);
          error.statusCode = 403;
          throw error;
        }

        // Vérifier les fonctionnalités requises
        if (requiredFeatures.length > 0) {
          const hasAllFeatures = requiredFeatures.every(feature =>
            validation.license.features.includes(feature)
          );

          if (!hasAllFeatures) {
            const error = new Error('Fonctionnalités insuffisantes');
            error.statusCode = 403;
            throw error;
          }
        }

        // Ajouter les informations de licence à la requête
        request.license = validation.license;
        request.licenseKey = licenseKey;

        // Continuer vers le handler suivant
        if (next) next();
        
      } catch (error) {
        if (reply) {
          reply.code(error.statusCode || 500).send({
            error: error.message,
            code: error.statusCode || 500
          });
        } else {
          throw error;
        }
      }
    };
  }
}

module.exports = LicenseValidationService;
