import React from 'react';
import { useLicense } from '../contexts/LicenseContext';

export const LicenseInfo = () => {
  const { license, isValid, revokeLicense } = useLicense();

  if (!isValid || !license) {
    return null;
  }

  const handleRevoke = () => {
    if (window.confirm('Êtes-vous sûr de vouloir déconnecter cette licence ?')) {
      revokeLicense();
    }
  };

  return (
    <div className="license-info">
      <h4>Informations de licence</h4>
      <ul>
        <li><strong>Clé :</strong> {license.key}</li>
        <li><strong>Client :</strong> {license.client?.name}</li>
        <li><strong>Statut :</strong> {license.status}</li>
        <li><strong>Fonctionnalités :</strong> {license.features.join(', ')}</li>
        {license.expiresAt && (
          <li>
            <strong>Expire le :</strong> {new Date(license.expiresAt).toLocaleDateString('fr-FR')}
          </li>
        )}
        {!license.expiresAt && (
          <li><strong>Validité :</strong> Permanente</li>
        )}
      </ul>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={handleRevoke}
          className="btn danger"
          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
        >
          Déconnecter la licence
        </button>
      </div>
    </div>
  );
};
