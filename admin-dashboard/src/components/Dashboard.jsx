import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";
import { Users, Activity, Shield, AlertTriangle } from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement des statistiques...</div>;
  }

  if (error) {
    return (
      <div className="alert error">
        Erreur lors du chargement des statistiques: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Tableau de bord</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <span className="stat-title">Clients total</span>
            <Users size={20} className="stat-icon" />
          </div>
          <div className="stat-value">{stats.totalClients}</div>
        </div>

        <div className="stat-card success">
          <div className="stat-header">
            <span className="stat-title">Licences actives</span>
            <Shield size={20} className="stat-icon" />
          </div>
          <div className="stat-value">{stats.activeLicenses}</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-header">
            <span className="stat-title">Total licences</span>
            <Activity size={20} className="stat-icon" />
          </div>
          <div className="stat-value">{stats.totalLicenses}</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-header">
            <span className="stat-title">Licences inactives</span>
            <AlertTriangle size={20} className="stat-icon" />
          </div>
          <div className="stat-value">
            {stats.expiredLicenses +
              stats.suspendedLicenses +
              stats.revokedLicenses}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Répartition des licences</h3>
          </div>
          <div className="card-content">
            <div className="status-breakdown">
              <div className="status-item">
                <span className="status-label">Actives:</span>
                <span className="status-badge active">
                  {stats.activeLicenses}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Expirées:</span>
                <span className="status-badge expired">
                  {stats.expiredLicenses}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Suspendues:</span>
                <span className="status-badge suspended">
                  {stats.suspendedLicenses}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Révoquées:</span>
                <span className="status-badge revoked">
                  {stats.revokedLicenses}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Actions rapides</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button
                className="btn success"
                onClick={() => (window.location.hash = "#clients")}
              >
                <Users size={16} />
                Nouveau client
              </button>
              <button
                className="btn primary"
                onClick={() => (window.location.hash = "#licenses")}
              >
                <Shield size={16} />
                Nouvelle licence
              </button>
              <button className="btn secondary" onClick={loadStats}>
                <Activity size={16} />
                Actualiser les stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
