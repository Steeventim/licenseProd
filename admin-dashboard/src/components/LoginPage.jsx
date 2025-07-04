import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, LogIn } from "lucide-react";

export function LoginPage({ onLogin, isLoading, error }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation basique
    const errors = {};
    if (!credentials.username.trim()) {
      errors.username = "Le nom d'utilisateur est requis";
    }
    if (!credentials.password) {
      errors.password = "Le mot de passe est requis";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      onLogin(credentials);
    }
  };

  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Effacer l'erreur pour ce champ
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Lock size={32} />
          </div>
          <h1>Dashboard Admin</h1>
          <p>Connectez-vous pour accéder à la gestion des licences</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                className={formErrors.username ? "error" : ""}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            {formErrors.username && (
              <span className="field-error">{formErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Entrez votre mot de passe"
                className={formErrors.password ? "error" : ""}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <span className="field-error">{formErrors.password}</span>
            )}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Accès réservé aux administrateurs autorisés</p>
        </div>
      </div>
    </div>
  );
}
