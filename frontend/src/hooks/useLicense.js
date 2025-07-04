// Hook personnalisé pour gérer la licence dans l'écosystème unifié
import { createContext, useContext, useEffect, useState } from "react";
import { licenseAPI } from "../services/licenseAPI";

// Contexte de licence
const LicenseContext = createContext();

// Provider de licence
export const LicenseProvider = ({ children }) => {
  const [licenseState, setLicenseState] = useState({
    loading: true,
    valid: false,
    license: null,
    features: [],
    error: null,
    licenseKey: null,
  });

  // Initialiser la licence au démarrage
  useEffect(() => {
    initializeLicense();
  }, []);

  const initializeLicense = async () => {
    try {
      // Récupérer la clé de licence depuis localStorage
      const licenseKey = localStorage.getItem("licenseKey");

      if (!licenseKey) {
        setLicenseState((prev) => ({
          ...prev,
          loading: false,
          valid: false,
          error: "Aucune clé de licence trouvée",
        }));
        return;
      }

      // Valider la licence
      const validation = await licenseAPI.validateLicense(licenseKey, {
        domain: window.location.hostname,
      });

      if (validation.valid) {
        setLicenseState({
          loading: false,
          valid: true,
          license: validation.license,
          features: validation.license.features || [],
          error: null,
          licenseKey,
        });

        // Démarrer les pings périodiques
        startPeriodicPing(licenseKey);
      } else {
        setLicenseState((prev) => ({
          ...prev,
          loading: false,
          valid: false,
          error: validation.error || "Licence invalide",
        }));
      }
    } catch (error) {
      console.error("Erreur initialisation licence:", error);
      setLicenseState((prev) => ({
        ...prev,
        loading: false,
        valid: false,
        error: error.message,
      }));
    }
  };

  const startPeriodicPing = (licenseKey) => {
    // Ping toutes les 5 minutes
    const pingInterval = setInterval(async () => {
      try {
        await licenseAPI.pingLicense(licenseKey);
      } catch (error) {
        console.error("Erreur ping licence:", error);
        // Si le ping échoue, revalider la licence
        initializeLicense();
      }
    }, 5 * 60 * 1000);

    // Nettoyer l'interval au démontage
    return () => clearInterval(pingInterval);
  };

  const setLicenseKey = (newLicenseKey) => {
    localStorage.setItem("licenseKey", newLicenseKey);
    initializeLicense();
  };

  const clearLicense = () => {
    localStorage.removeItem("licenseKey");
    setLicenseState({
      loading: false,
      valid: false,
      license: null,
      features: [],
      error: null,
      licenseKey: null,
    });
  };

  const hasFeature = (featureName) => {
    return licenseState.features.includes(featureName);
  };

  const hasAllFeatures = (featureNames) => {
    return featureNames.every((feature) =>
      licenseState.features.includes(feature)
    );
  };

  const contextValue = {
    ...licenseState,
    setLicenseKey,
    clearLicense,
    hasFeature,
    hasAllFeatures,
    refreshLicense: initializeLicense,
  };

  return (
    <LicenseContext.Provider value={contextValue}>
      {children}
    </LicenseContext.Provider>
  );
};

// Hook pour utiliser la licence
export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error("useLicense must be used within a LicenseProvider");
  }
  return context;
};
