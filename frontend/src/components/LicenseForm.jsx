import React, { useState } from 'react';
import { useLicense } from '../contexts/LicenseContext';

export const LicenseForm = () => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateLicense, error, clearError } = useLicense();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!licenseKey.trim()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const result = await validateLicense(licenseKey.trim());
      
      if (result.success) {
        setLicenseKey('');
        // La redirection ou mise à jour se fait automatiquement via le contexte
      }
    } catch (err) {
      // L'erreur est gérée dans le contexte
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="license-form">
      <h2>Activation de licence</h2>
      <p>Veuillez entrer votre clé de licence pour activer l'application.</p>
      
      {error && (
        <div className="alert error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="licenseKey">Clé de licence</label>
          <input
            type="text"
            id="licenseKey"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="LIC-XXXXXXXX-XXXXXXXXX"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn"
          disabled={isSubmitting || !licenseKey.trim()}
        >
          {isSubmitting ? 'Validation...' : 'Activer la licence'}
        </button>
      </form>
    </div>
  );
};
