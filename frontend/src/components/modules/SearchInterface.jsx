// Interface pour le moteur de recherche intelligent
import React from 'react';

const SearchInterface = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔍 Recherche Intelligente - Search Engine
        </h2>
        <p className="text-gray-600">
          Moteur de recherche intelligent avec IA, Elasticsearch et gestion avancée de fichiers.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search Engine
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Application Next.js avancée pour la recherche intelligente de documents 
              avec suggestions IA et interface d'administration complète.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🧠 Intelligence</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Recherche sémantique</li>
                  <li>• Suggestions intelligentes</li>
                  <li>• Corrections orthographiques</li>
                  <li>• Analyse comportementale</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">📊 Fonctionnalités</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prévisualisation PDF</li>
                  <li>• Upload multi-format</li>
                  <li>• Statistiques avancées</li>
                  <li>• Dashboard admin</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => window.open('http://localhost:3005', '_blank')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Ouvrir Search Engine →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
