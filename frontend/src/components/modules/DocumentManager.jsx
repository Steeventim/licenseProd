// Interface pour le module de gestion documentaire (BackBPMF)
import React from 'react';

const DocumentManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📄 Gestion Documentaire - BackBPMF
        </h2>
        <p className="text-gray-600">
          Système de gestion documentaire avec workflow et validation.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Module BackBPMF
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Ce module s'exécute sur un serveur séparé avec ses propres fonctionnalités 
              de gestion documentaire, workflow et authentification.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">✨ Fonctionnalités</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Upload de documents</li>
                  <li>• Workflow de validation</li>
                  <li>• Système de commentaires</li>
                  <li>• Notifications temps réel</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">🔧 Technologies</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fastify + Sequelize</li>
                  <li>• PostgreSQL</li>
                  <li>• JWT Auth</li>
                  <li>• WebSockets</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => window.open('http://localhost:3004', '_blank')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Ouvrir BackBPMF →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
