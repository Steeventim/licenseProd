import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { licenseAPI } from '../services/licenseAPI';

// Types d'actions pour le reducer
const LICENSE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_LICENSE: 'SET_LICENSE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_OFFLINE_MODE: 'SET_OFFLINE_MODE'
};

// État initial
const initialState = {
  license: null,
  isValid: false,
  isLoading: true,
  error: null,
  isOfflineMode: false,
  lastValidation: null
};

// Reducer pour gérer l'état des licences
function licenseReducer(state, action) {
  switch (action.type) {
    case LICENSE_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null };
    
    case LICENSE_ACTIONS.SET_LICENSE:
      return {
        ...state,
        license: action.payload.license,
        isValid: action.payload.isValid,
        isLoading: false,
        error: null,
        lastValidation: new Date().toISOString()
      };
    
    case LICENSE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        license: null,
        isValid: false
      };
    
    case LICENSE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case LICENSE_ACTIONS.SET_OFFLINE_MODE:
      return { ...state, isOfflineMode: action.payload };
    
    default:
      return state;
  }
}

// Création du contexte
const LicenseContext = createContext();

// Hook pour utiliser le contexte
export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense doit être utilisé dans un LicenseProvider');
  }
  return context;
};

// Provider du contexte de licence
export const LicenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(licenseReducer, initialState);

  // Valider la licence
  const validateLicense = async (licenseKey = null) => {
    dispatch({ type: LICENSE_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Utiliser la clé fournie ou celle stockée
      const keyToUse = licenseKey || localStorage.getItem('licenseKey');
      
      if (!keyToUse) {
        throw new Error('Aucune clé de licence trouvée');
      }
      
      const result = await licenseAPI.validateLicense(keyToUse, {
        domain: window.location.hostname
      });
      
      if (result.valid) {
        // Stocker la clé et les informations de licence
        localStorage.setItem('licenseKey', keyToUse);
        localStorage.setItem('licenseData', JSON.stringify(result.license));
        
        dispatch({
          type: LICENSE_ACTIONS.SET_LICENSE,
          payload: {
            license: result.license,
            isValid: true
          }
        });
        
        return { success: true, license: result.license };
      } else {
        throw new Error(result.error || 'Licence invalide');
      }
      
    } catch (error) {
      console.error('Erreur validation licence:', error);
      
      // Tenter le mode offline si disponible
      const offlineResult = await tryOfflineValidation();
      if (offlineResult.success) {
        return offlineResult;
      }
      
      // Nettoyer le stockage local
      localStorage.removeItem('licenseKey');
      localStorage.removeItem('licenseData');
      
      dispatch({
        type: LICENSE_ACTIONS.SET_ERROR,
        payload: error.message || 'Erreur de validation de licence'
      });
      
      return { success: false, error: error.message };
    }
  };

  // Validation offline avec JWT
  const tryOfflineValidation = async () => {
    try {
      const storedLicenseData = localStorage.getItem('licenseData');
      if (!storedLicenseData) {
        return { success: false };
      }
      
      const licenseData = JSON.parse(storedLicenseData);
      
      // Vérifier l'expiration côté client
      if (licenseData.expiresAt && new Date() > new Date(licenseData.expiresAt)) {
        throw new Error('Licence expirée');
      }
      
      // En mode offline, on fait confiance aux données stockées
      dispatch({ type: LICENSE_ACTIONS.SET_OFFLINE_MODE, payload: true });
      dispatch({
        type: LICENSE_ACTIONS.SET_LICENSE,
        payload: {
          license: licenseData,
          isValid: true
        }
      });
      
      return { success: true, license: licenseData, offline: true };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Vérifier si une fonctionnalité est autorisée
  const hasFeature = (featureName) => {
    if (!state.license || !state.isValid) {
      return false;
    }
    return state.license.features.includes(featureName);
  };

  // Révoquer la licence (logout)
  const revokeLicense = () => {
    localStorage.removeItem('licenseKey');
    localStorage.removeItem('licenseData');
    dispatch({
      type: LICENSE_ACTIONS.SET_LICENSE,
      payload: {
        license: null,
        isValid: false
      }
    });
  };

  // Ping périodique (optionnel)
  const pingLicense = async () => {
    const licenseKey = localStorage.getItem('licenseKey');
    if (!licenseKey || !state.isValid) return;
    
    try {
      await licenseAPI.pingLicense(licenseKey);
    } catch (error) {
      console.warn('Ping licence échoué:', error);
    }
  };

  // Effets de bord
  useEffect(() => {
    // Validation automatique au chargement
    const storedKey = localStorage.getItem('licenseKey');
    if (storedKey) {
      validateLicense(storedKey);
    } else {
      dispatch({ type: LICENSE_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  useEffect(() => {
    // Ping périodique toutes les 5 minutes
    const pingInterval = setInterval(pingLicense, 5 * 60 * 1000);
    return () => clearInterval(pingInterval);
  }, [state.isValid]);

  // Valeurs du contexte
  const contextValue = {
    // État
    ...state,
    
    // Actions
    validateLicense,
    hasFeature,
    revokeLicense,
    pingLicense,
    
    // Helpers
    clearError: () => dispatch({ type: LICENSE_ACTIONS.CLEAR_ERROR })
  };

  return (
    <LicenseContext.Provider value={contextValue}>
      {children}
    </LicenseContext.Provider>
  );
};
