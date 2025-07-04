import React, { useState } from "react";
import { useLicense } from "../hooks/useLicense.jsx";
import { Shield, ShieldX, Key, AlertCircle } from "lucide-react";

export const LicenseGuard = ({ children, feature = null, fallback = null }) => {
  const { loading, valid, license, error, setLicenseKey } = useLicense();
  const [inputKey, setInputKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-700">Vérification de la licence...</span>
          </div>
        </div>
      </div>
    );
  }

  // Interface de saisie de licence si aucune licence valide
  if (!valid || error) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!inputKey.trim()) return;

      setIsValidating(true);
      try {
        await setLicenseKey(inputKey.trim());
      } catch (err) {
        console.error("Erreur validation licence:", err);
      } finally {
        setIsValidating(false);
      }
    };

    const handleTestLicense = () => {
      setInputKey("LIC-MCDMX42E-00F42483307651B46A8E5843AEF7AC47");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Validation de Licence
            </h1>
            <p className="text-gray-600">
              Veuillez entrer votre clé de licence pour accéder à l'application
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="licenseKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Clé de licence
              </label>
              <input
                id="licenseKey"
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="LIC-XXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={isValidating}
              />
            </div>

            <button
              type="submit"
              disabled={!inputKey.trim() || isValidating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Validation...</span>
                </div>
              ) : (
                "Valider la licence"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-3">
              Pour les tests, vous pouvez utiliser :
            </p>
            <button
              onClick={handleTestLicense}
              className="w-full text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Utiliser la licence de test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vérification d'une fonctionnalité spécifique
  if (feature && license && !license.features?.includes(feature)) {
    const featureFallback = (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <ShieldX size={20} />
          <div>
            <strong>Accès refusé</strong>
            <p>Votre licence ne comprend pas la fonctionnalité "{feature}".</p>
          </div>
        </div>
      </div>
    );

    return fallback || featureFallback;
  }

  // Affichage des enfants si tout est OK
  return children;
};

export const LicenseStatus = () => {
  const { license, valid, loading, error } = useLicense();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
        <div>Vérification...</div>
      </div>
    );
  }

  if (!valid || error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800">
        <ShieldX size={16} />
        <span>Licence invalide</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800">
      <Shield size={16} />
      <span>
        Licence valide
        {license && license.expiresAt && (
          <small className="block text-xs opacity-80">
            Expire le {new Date(license.expiresAt).toLocaleDateString("fr-FR")}
          </small>
        )}
      </span>
    </div>
  );
};

export const FeatureGuard = ({
  feature,
  children,
  fallbackComponent = null,
}) => {
  const { features } = useLicense();

  const hasFeature = (featureName) => {
    return features && features.includes(featureName);
  };

  if (!hasFeature(feature)) {
    return (
      fallbackComponent || (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm text-gray-500">
          <h3>Fonctionnalité non autorisée</h3>
          <p>Votre licence ne comprend pas la fonctionnalité "{feature}".</p>
        </div>
      )
    );
  }

  return children;
};
