// Composant guard pour protéger l'accès selon les fonctionnalités de licence
import React from 'react';
import { useLicense } from '../hooks/useLicense.jsx';
import { Lock, AlertCircle } from 'lucide-react';

export const FeatureGuard = ({ 
  children, 
  requiredFeatures = [], 
  fallback = null,
  showUpgrade = true 
}) => {
  const { hasAllFeatures, features, license } = useLicense();

  // Si aucune fonctionnalité requise, afficher le contenu
  if (!requiredFeatures || requiredFeatures.length === 0) {
    return children;
  }

  // Vérifier si toutes les fonctionnalités sont disponibles
  if (hasAllFeatures && hasAllFeatures(requiredFeatures)) {
    return children;
  }

  // Fallback simple : vérifier si les features sont dans le tableau
  const hasRequiredFeatures = requiredFeatures.every(feature => 
    features && features.includes(feature)
  );

  if (hasRequiredFeatures) {
    return children;
  }

  // Si un fallback est fourni, l'utiliser
  if (fallback) {
    return fallback;
  }

  // Affichage par défaut pour fonctionnalités manquantes
  const missingFeatures = requiredFeatures.filter(feature => 
    !features || !features.includes(feature)
  );

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
          <Lock className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-yellow-800">
            Fonctionnalités Non Disponibles
          </h3>
          <p className="text-yellow-700">
            Cette fonctionnalité nécessite une licence étendue
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-yellow-700 mb-2">
          <strong>Fonctionnalités requises :</strong> {requiredFeatures.join(', ')}
        </p>
        <p className="text-sm text-yellow-700 mb-2">
          <strong>Fonctionnalités manquantes :</strong> {missingFeatures.join(', ')}
        </p>
        <p className="text-sm text-yellow-700">
          <strong>Votre licence actuelle :</strong> {features && features.length > 0 ? features.join(', ') : 'Aucune fonctionnalité'}
        </p>
      </div>

      {showUpgrade && (
        <div className="pt-4 border-t border-yellow-200">
          <p className="text-sm text-yellow-700 mb-3">
            Pour accéder à cette fonctionnalité, contactez votre administrateur pour une mise à niveau de licence.
          </p>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium">
            Contacter l'administrateur
          </button>
        </div>
      )}
    </div>
  );
};

export default FeatureGuard;
