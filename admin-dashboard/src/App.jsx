import React, { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { ClientsManager } from "./components/ClientsManager";
import { LicensesManager } from "./components/LicensesManager";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { BarChart3, Users, Shield } from "lucide-react";
import { authService } from "./services/authService";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.verifyToken();
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setLoginError(error.message || "Erreur de connexion");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveTab("dashboard");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <ClientsManager />;
      case "licenses":
        return <LicensesManager />;
      default:
        return <Dashboard />;
    }
  };

  // Affichage de chargement initial
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Affichage de la page de connexion si non authentifié
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        isLoading={loginLoading}
        error={loginError}
      />
    );
  }

  // Affichage de l'interface d'administration
  return (
    <div className="App">
      <Header user={currentUser} onLogout={handleLogout} />

      <main className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 size={18} />
            Tableau de bord
          </button>
          <button
            className={`tab ${activeTab === "clients" ? "active" : ""}`}
            onClick={() => setActiveTab("clients")}
          >
            <Users size={18} />
            Clients
          </button>
          <button
            className={`tab ${activeTab === "licenses" ? "active" : ""}`}
            onClick={() => setActiveTab("licenses")}
          >
            <Shield size={18} />
            Licences
          </button>
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
