// Interface pour le module BPM (FrontBPMF)
import React from 'react';

const BPMInterface = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ⚙️ Business Process Management - FrontBPMF
        </h2>
        <p className="text-gray-600">
          Interface moderne pour la gestion des processus métier et workflows d'entreprise.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              FrontBPMF
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Application React/TypeScript moderne pour la gestion des processus 
              d'entreprise avec interface intuitive et workflows personnalisables.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔄 Workflows</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Création de processus</li>
                  <li>• Gestion des étapes</li>
                  <li>• Suivi en temps réel</li>
                  <li>• Validation multi-niveaux</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">💻 Interface</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React + TypeScript</li>
                  <li>• Interface responsive</li>
                  <li>• Assistant de config</li>
                  <li>• Thème personnalisable</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚠️</span>
                  <span className="text-sm text-yellow-700">
                    Module en cours d'installation
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.open('http://localhost:5173', '_blank')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Ouvrir FrontBPMF →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPMInterface;
