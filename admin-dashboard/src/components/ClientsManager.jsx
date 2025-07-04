import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";
import { Plus, Edit, Trash2, User } from "lucide-react";

export const ClientsManager = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getClients(1, 100);
      setClients(data.clients);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await adminAPI.updateClient(editingClient.id, formData);
      } else {
        await adminAPI.createClient(formData);
      }
      setShowModal(false);
      setEditingClient(null);
      setFormData({ name: "", email: "", domain: "" });
      loadClients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      domain: client.domain || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await adminAPI.deleteClient(clientId);
        loadClients();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", domain: "" });
    setShowModal(true);
  };

  if (loading) {
    return <div>Chargement des clients...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestion des clients</h2>
        <button className="btn success" onClick={openCreateModal}>
          <Plus size={16} />
          Nouveau client
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card">
        <div className="card-content">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Domaine</th>
                <th>Licences</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="user-info-cell">
                      <User size={16} />
                      {client.name}
                    </div>
                  </td>
                  <td>{client.email}</td>
                  <td>{client.domain || "-"}</td>
                  <td>{client.licensesCount || 0}</td>
                  <td>
                    {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn secondary"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clients.length === 0 && (
            <div className="empty-state">Aucun client trouvé</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingClient ? "Modifier le client" : "Nouveau client"}
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Domaine autorisé</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value })
                    }
                    placeholder="example.com"
                  />
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
                  {editingClient ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
