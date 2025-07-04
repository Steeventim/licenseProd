import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";
import {
  Plus,
  Shield,
  Key,
  Ban,
  RotateCcw,
  Info,
  Trash2,
  Edit3,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const AVAILABLE_FEATURES = [
  "basic",
  "bpm",
  "search",
  "export",
  "analytics",
  "reports",
  "documents",
];

export const LicensesManager = () => {
  const [licenses, setLicenses] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [formData, setFormData] = useState({
    clientId: "",
    features: ["basic"],
    expiresAt: "",
  });
  const [editFormData, setEditFormData] = useState({
    status: "",
    features: [],
    expiresAt: "",
  });

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [licensesData, clientsData] = await Promise.all([
        adminAPI.getLicenses(1, 100, selectedStatus || null),
        adminAPI.getClients(1, 1000),
      ]);
      setLicenses(licensesData.licenses);
      setClients(clientsData.clients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const licenseData = {
        ...formData,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : null,
      };

      await adminAPI.createLicense(licenseData);
      setShowModal(false);
      setFormData({ clientId: "", features: ["basic"], expiresAt: "" });
      setSuccess("Licence créée avec succès");
      loadData();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevoke = async (licenseKey) => {
    if (window.confirm("Êtes-vous sûr de vouloir révoquer cette licence ?")) {
      try {
        await adminAPI.revokeLicense(licenseKey);
        setSuccess("Licence révoquée avec succès");
        loadData();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDelete = async (licenseId, licenseKey) => {
    if (
      window.confirm(
        "⚠️ ATTENTION : Êtes-vous sûr de vouloir SUPPRIMER définitivement cette licence ?\n\nCette action est irréversible et supprimera également tous les logs associés."
      )
    ) {
      try {
        await adminAPI.deleteLicense(licenseId);
        setSuccess("Licence supprimée avec succès");
        loadData();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (license) => {
    setEditingLicense(license);
    setEditFormData({
      status: license.status,
      features: [...license.features],
      expiresAt: license.expiresAt
        ? new Date(license.expiresAt).toISOString().slice(0, 16)
        : "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...editFormData,
        expiresAt: editFormData.expiresAt
          ? new Date(editFormData.expiresAt).toISOString()
          : null,
      };

      await adminAPI.updateLicense(editingLicense.id, updateData);
      setSuccess("Licence modifiée avec succès");
      setShowEditModal(false);
      setEditingLicense(null);
      loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFeatureChange = (feature, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        features: [...formData.features, feature],
      });
    } else {
      setFormData({
        ...formData,
        features: formData.features.filter((f) => f !== feature),
      });
    }
  };

  const handleEditFeatureChange = (feature, checked) => {
    if (checked) {
      setEditFormData({
        ...editFormData,
        features: [...editFormData.features, feature],
      });
    } else {
      setEditFormData({
        ...editFormData,
        features: editFormData.features.filter((f) => f !== feature),
      });
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
    );
  };

  const openCreateModal = () => {
    setFormData({ clientId: "", features: ["basic"], expiresAt: "" });
    setShowModal(true);
  };

  if (loading) {
    return <div>Chargement des licences...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestion des licences</h2>
        <button className="btn success" onClick={openCreateModal}>
          <Plus size={16} />
          Nouvelle licence
        </button>
      </div>

      {error && (
        <div className="alert error">
          {error}
          <button onClick={() => setError(null)} className="alert-close-btn">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
          <button onClick={() => setSuccess(null)} className="alert-close-btn">
            ×
          </button>
        </div>
      )}

      <div className="filter-section">
        <label>Filtrer par statut:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="SUSPENDED">Suspendu</option>
          <option value="REVOKED">Révoqué</option>
          <option value="EXPIRED">Expiré</option>
        </select>
      </div>

      <div className="card">
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>Clé de licence</th>
                <th>Client</th>
                <th>Statut</th>
                <th>Fonctionnalités</th>
                <th>Expiration</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id}>
                  <td>
                    <div className="license-key-cell">
                      <Key size={16} />
                      <code className="license-key-code">
                        {license.key.substring(0, 20)}...
                      </code>
                    </div>
                  </td>
                  <td>{license.client.name}</td>
                  <td>{getStatusBadge(license.status)}</td>
                  <td>
                    <div className="features-list">
                      {license.features.join(", ")}
                    </div>
                  </td>
                  <td>
                    {license.expiresAt
                      ? format(new Date(license.expiresAt), "dd/MM/yyyy", {
                          locale: fr,
                        })
                      : "Permanente"}
                  </td>
                  <td>
                    {format(new Date(license.createdAt), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </td>
                  <td>
                    <div className="actions">
                      {license.status === "ACTIVE" && (
                        <button
                          className="btn danger"
                          onClick={() => handleRevoke(license.key)}
                          title="Révoquer"
                        >
                          <Ban size={14} />
                        </button>
                      )}
                      <button
                        className="btn secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(license.key);
                          setSuccess("Clé copiée dans le presse-papiers");
                          setTimeout(() => setSuccess(null), 2000);
                        }}
                        title="Copier la clé"
                      >
                        <Key size={14} />
                      </button>
                      <button
                        className="btn danger"
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "#dc2626",
                        }}
                        onClick={() => handleDelete(license.id, license.key)}
                        title="Supprimer définitivement"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        className="btn primary"
                        onClick={() => handleEdit(license)}
                        title="Modifier"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {licenses.length === 0 && (
            <div className="empty-state">Aucune licence trouvée</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Nouvelle licence</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Client *</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) =>
                      setFormData({ ...formData, clientId: e.target.value })
                    }
                    required
                  >
                    <option value="">Sélectionnez un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fonctionnalités *</label>
                  <div className="checkbox-group">
                    {AVAILABLE_FEATURES.map((feature) => (
                      <div key={feature} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`feature-${feature}`}
                          checked={formData.features.includes(feature)}
                          onChange={(e) =>
                            handleFeatureChange(feature, e.target.checked)
                          }
                        />
                        <label htmlFor={`feature-${feature}`}>{feature}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Date d'expiration (optionnel)</label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                  />
                  <small className="form-hint">
                    Laissez vide pour une licence permanente
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn success">
                  Créer la licence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingLicense && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Modifier la licence</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Statut *</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="REVOKED">Révoqué</option>
                    <option value="EXPIRED">Expiré</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fonctionnalités *</label>
                  <div className="checkbox-group">
                    {AVAILABLE_FEATURES.map((feature) => (
                      <div key={feature} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`edit-feature-${feature}`}
                          checked={editFormData.features.includes(feature)}
                          onChange={(e) =>
                            handleEditFeatureChange(feature, e.target.checked)
                          }
                        />
                        <label htmlFor={`edit-feature-${feature}`}>
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Date d'expiration (optionnel)</label>
                  <input
                    type="datetime-local"
                    value={editFormData.expiresAt}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        expiresAt: e.target.value,
                      })
                    }
                  />
                  <small className="form-hint">
                    Laissez vide pour une licence permanente
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn success">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
