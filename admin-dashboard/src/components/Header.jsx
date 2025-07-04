import React from "react";
import { LogOut, User, Shield, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function Header({ user, onLogout }) {
  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return "Première connexion";

    try {
      return formatDistanceToNow(new Date(lastLogin), {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      return "Date inconnue";
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <Shield size={28} className="header-icon" />
            <div className="header-title">
              <h1>Dashboard Admin</h1>
              <p>Gestion des Licences</p>
            </div>
          </div>

          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                <User size={16} />
              </div>
              <div className="user-details">
                <span className="user-name">{user?.username}</span>
                <div className="user-meta">
                  <Clock size={12} />
                  <span className="last-login">
                    {formatLastLogin(user?.lastLogin)}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="logout-button"
              onClick={onLogout}
              title="Se déconnecter"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
