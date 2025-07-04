// Interface Client Moderne - Écosystème Unifié de Gestion de Licences
// Design moderne avec Tailwind CSS et architecture modulaire - Version 2.0

import React, { useState, useEffect } from "react";
import { useLicense } from "../hooks/useLicense.jsx";
import { LicenseGuard } from "../components/LicenseGuard";
import { FeatureGuard } from "./FeatureGuard";
import {
  Home,
  Key,
  FileText,
  Search,
  Settings,
  Users,
  Shield,
  Menu,
  X,
  ExternalLink,
  Clock,
  Check,
  Activity,
  TrendingUp,
  Star,
  AlertCircle,
  BarChart3,
  Zap,
  Lock,
  Globe,
  Database,
  Workflow,
  Bell,
  RefreshCw,
  ChevronRight,
  Plus,
} from "lucide-react";

// Import des composants des modules avec gestion d'erreur améliorée
const DocumentManager = React.lazy(() =>
  import("./modules/DocumentManager").catch(() => ({
    default: () => <ModuleFallback moduleName="Gestion Documentaire" />,
  }))
);
const SearchInterface = React.lazy(() =>
  import("./modules/SearchInterface").catch(() => ({
    default: () => <ModuleFallback moduleName="Recherche Intelligente" />,
  }))
);
const BPMInterface = React.lazy(() =>
  import("./modules/BPMInterface").catch(() => ({
    default: () => <ModuleFallback moduleName="Interface BPM" />,
  }))
);

// Composant de fallback pour modules manquants
const ModuleFallback = ({ moduleName }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Settings className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-blue-900 mb-2">
      Module {moduleName}
    </h3>
    <p className="text-blue-700 mb-4">
      Ce module est en cours de développement
    </p>
    <div className="text-sm text-blue-600">
      Fonctionnalité bientôt disponible
    </div>
  </div>
);

const AnalyticsModule = React.lazy(() =>
  import("./modules/AnalyticsModule").catch(() => ({
    default: () => <ModuleFallback moduleName="Analytics & Reporting" />,
  }))
);

const UnifiedApp = () => {
  const { license, features, loading, error } = useLicense();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [moduleErrors, setModuleErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    status: "operational",
    uptime: "99.9%",
  });

  // Effect pour la santé du système (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => ({
        ...prev,
        uptime: (Math.random() * 1 + 99).toFixed(1) + "%",
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Modules disponibles selon la licence - Configuration enrichie
  const availableModules = [
    {
      id: "dashboard",
      name: "Tableau de Bord",
      icon: Home,
      description: "Vue d'ensemble de votre écosystème",
      requiredFeatures: [],
      component: DashboardModule,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      category: "core",
      status: "active",
    },
    {
      id: "documents",
      name: "Gestion Documentaire",
      icon: FileText,
      description: "Workflow et gestion de documents DGI",
      requiredFeatures: ["documents"],
      component: DocumentManager,
      url: "http://localhost:3004",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      category: "workflow",
      status: "active",
    },
    {
      id: "search",
      name: "Recherche Intelligente",
      icon: Search,
      description: "Moteur de recherche avec IA et analyse de documents",
      requiredFeatures: ["search"],
      component: SearchInterface,
      url: "http://localhost:3000",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      category: "ai",
      status: "active",
    },
    {
      id: "bpm",
      name: "Interface BPM",
      icon: Workflow,
      description: "Business Process Management avancé",
      requiredFeatures: ["bpm"],
      component: BPMInterface,
      url: "http://localhost:5174",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      category: "workflow",
      status: "active",
    },
    {
      id: "analytics",
      name: "Analytics & Reporting",
      icon: BarChart3,
      description: "Tableaux de bord et rapports avancés",
      requiredFeatures: ["analytics", "reports"],
      component: AnalyticsModule,
      gradient: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      category: "analytics",
      status: "beta",
    },
  ];

  // Filtrer les modules disponibles selon la licence
  const accessibleModules = availableModules.filter((module) => {
    if (module.requiredFeatures.length === 0) return true;
    return module.requiredFeatures.every((feature) =>
      features.includes(feature)
    );
  });

  const handleModuleError = (moduleId, error) => {
    setModuleErrors((prev) => ({
      ...prev,
      [moduleId]: error,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Chargement de votre écosystème...
          </h2>
          <p className="text-gray-500">Validation de la licence en cours</p>
        </div>
      </div>
    );
  }

  return (
    <LicenseGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header moderne avec notifications */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo et titre */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Écosystème Unifié
                    </h1>
                    <div className="hidden sm:block text-xs text-gray-500">
                      Plateforme de Gestion Intégrée
                    </div>
                  </div>
                </div>
              </div>

              {/* Centre - Module actuel */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-lg">
                {(() => {
                  const currentModule = availableModules.find(
                    (m) => m.id === activeModule
                  );
                  if (!currentModule) return null;
                  const IconComponent = currentModule.icon;
                  return (
                    <>
                      <IconComponent
                        className={`w-4 h-4 ${currentModule.textColor}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {currentModule.name}
                      </span>
                      {currentModule.status === "beta" && (
                        <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          BETA
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Informations de licence et notifications */}
              <div className="flex items-center space-x-4">
                {/* Statut système */}
                <div className="hidden lg:flex items-center space-x-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        systemHealth.status === "operational"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                    <span>Système opérationnel</span>
                  </div>
                  <div className="text-gray-400">•</div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4" />
                    <span>{systemHealth.uptime}</span>
                  </div>
                </div>

                {/* Informations de licence compactes */}
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className="max-w-24 truncate">
                      {license?.client?.name || "Client"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>
                      {features.length} feature{features.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Indicateur de statut */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Actif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar responsive */}
          <aside
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white 
            shadow-lg lg:shadow-none transition-transform duration-300 ease-in-out`}
          >
            {/* Header mobile */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Navigation
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation par catégories */}
            <nav className="p-4 space-y-6">
              {/* Modules Core */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Modules Principaux
                </h3>
                {accessibleModules
                  .filter((module) => module.category === "core")
                  .map((module) => renderNavigationItem(module))}
              </div>

              {/* Modules Management */}
              {accessibleModules.some((m) => m.category === "management") && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Gestion
                  </h3>
                  {accessibleModules
                    .filter((module) => module.category === "management")
                    .map((module) => renderNavigationItem(module))}
                </div>
              )}

              {/* Modules Workflow */}
              {accessibleModules.some((m) => m.category === "workflow") && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Workflow & Documents
                  </h3>
                  {accessibleModules
                    .filter((module) => module.category === "workflow")
                    .map((module) => renderNavigationItem(module))}
                </div>
              )}

              {/* Modules AI & Analytics */}
              {accessibleModules.some((m) =>
                ["ai", "analytics"].includes(m.category)
              ) && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Intelligence & Analytics
                  </h3>
                  {accessibleModules
                    .filter((module) =>
                      ["ai", "analytics"].includes(module.category)
                    )
                    .map((module) => renderNavigationItem(module))}
                </div>
              )}

              {/* Modules non disponibles */}
              {availableModules.length > accessibleModules.length && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Non Disponibles
                  </h3>
                  {availableModules
                    .filter((module) => !accessibleModules.includes(module))
                    .map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center px-3 py-2 rounded-lg opacity-50 cursor-not-allowed mb-2"
                      >
                        <module.icon className="w-5 h-5 mr-3 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-400">
                            {module.name}
                          </div>
                          <div className="text-sm text-gray-400 truncate">
                            Licence insuffisante
                          </div>
                        </div>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                </div>
              )}

              {/* Informations de licence compactes */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex justify-between">
                    <span>Licence:</span>
                    <span className="font-medium">
                      {license?.client?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <span className="font-medium">{features.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expire:</span>
                    <span className="font-medium">
                      {license?.expiresAt
                        ? new Date(license.expiresAt).toLocaleDateString(
                            "fr-FR"
                          )
                        : "Jamais"}
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </aside>

          {/* Overlay pour mobile */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Contenu principal */}
          <main className="flex-1 lg:ml-0">
            <div className="p-6">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Chargement du module...</p>
                    </div>
                  </div>
                }
              >
                {renderActiveModule()}
              </React.Suspense>
            </div>
          </main>
        </div>
      </div>
    </LicenseGuard>
  );

  // Fonction pour rendre un élément de navigation
  function renderNavigationItem(module) {
    const IconComponent = module.icon;
    const isActive = activeModule === module.id;

    return (
      <button
        key={module.id}
        onClick={() => {
          setActiveModule(module.id);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 mb-2 ${
          isActive
            ? `bg-gradient-to-r ${module.gradient} text-white shadow-md transform scale-[0.98]`
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
        }`}
      >
        <IconComponent
          className={`w-5 h-5 mr-3 ${
            isActive ? "text-white" : module.textColor
          }`}
        />
        <div className="flex-1 min-w-0">
          <div
            className={`font-medium ${
              isActive ? "text-white" : "text-gray-900"
            }`}
          >
            {module.name}
          </div>
          <div
            className={`text-sm truncate ${
              isActive ? "text-white/80" : "text-gray-500"
            }`}
          >
            {module.description}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {module.status === "beta" && !isActive && (
            <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
              BETA
            </span>
          )}
          {module.url && (
            <ExternalLink
              className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`}
            />
          )}
          {isActive && <ChevronRight className="w-4 h-4 text-white" />}
        </div>
      </button>
    );
  }

  function renderActiveModule() {
    const module = accessibleModules.find((m) => m.id === activeModule);
    if (!module)
      return <div className="text-center text-gray-500">Module non trouvé</div>;

    // Si le module a une erreur
    if (moduleErrors[module.id]) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-medium text-red-900">
              Erreur du module {module.name}
            </h3>
          </div>
          <p className="text-red-700 mb-4">{moduleErrors[module.id]}</p>
          <button
            onClick={() => {
              setModuleErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[module.id];
                return newErrors;
              });
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      );
    }

    // Rendu selon le type de module
    if (module.url) {
      // Module externe (iframe ou redirect)
      return (
        <ExternalModuleWrapper
          module={module}
          onError={(error) => handleModuleError(module.id, error)}
        />
      );
    } else {
      // Module interne
      const Component = module.component;
      const moduleFeatures = Array.isArray(module.requiredFeatures)
        ? module.requiredFeatures
        : [];
      return (
        <FeatureGuard requiredFeatures={moduleFeatures}>
          <Component />
        </FeatureGuard>
      );
    }
  }
};

// Composant pour les modules externes
const ExternalModuleWrapper = ({ module, onError }) => {
  const [loading, setLoading] = useState(false);
  const { license, licenseKey } = useLicense();

  const openInNewTab = () => {
    const url = `${module.url}?licenseKey=${licenseKey}&client=${
      license?.client?.id || "default"
    }`;
    window.open(url, "_blank");
  };

  const IconComponent = module.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 ${module.bgColor} rounded-lg flex items-center justify-center`}
          >
            <IconComponent className={`w-6 h-6 ${module.textColor}`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {module.name}
            </h2>
            <p className="text-gray-500">{module.description}</p>
          </div>
        </div>
        <button
          onClick={openInNewTab}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Ouvrir</span>
        </button>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div
            className={`w-16 h-16 ${module.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <IconComponent className={`w-8 h-8 ${module.textColor}`} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {module.name}
          </h3>
          <p className="text-gray-600 mb-4">{module.description}</p>
          <p className="text-sm text-gray-500 mb-6">
            Ce module s'exécute sur {module.url}
          </p>
          <button
            onClick={openInNewTab}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            <span>Accéder au module</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Module Dashboard moderne et enrichi
const DashboardModule = () => {
  const { license, features } = useLicense();
  const [systemStats, setSystemStats] = useState({
    documentsProcessed: 1247,
    activeUsers: 23,
    searchQueries: 5892,
    systemUptime: "99.8%",
  });

  const stats = [
    {
      name: "Licence Client",
      value: license?.client?.name || "Non défini",
      icon: Key,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      name: "Fonctionnalités",
      value: features.length,
      suffix: " actives",
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-50",
      gradient: "from-green-500 to-green-600",
    },
    {
      name: "Documents Traités",
      value: systemStats.documentsProcessed.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      name: "Disponibilité",
      value: systemStats.systemUptime,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const quickActions = [
    {
      name: "Nouvelle Recherche",
      description: "Lancer une recherche intelligente",
      icon: Search,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: () => console.log("Search action"),
    },
    {
      name: "Importer Documents",
      description: "Ajouter de nouveaux documents",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: () => console.log("Import action"),
    },
    {
      name: "Voir Analytics",
      description: "Consulter les statistiques",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: () => console.log("Analytics action"),
    },
    {
      name: "Workflow BPM",
      description: "Gérer les processus métier",
      icon: Workflow,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: () => console.log("BPM action"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec bienvenue personnalisée */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bienvenue dans votre Écosystème
            </h1>
            <p className="text-blue-100">
              Tableau de bord unifié pour{" "}
              {license?.client?.name || "votre organisation"} • Dernière
              connexion aujourd'hui à{" "}
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{features.length}</div>
              <div className="text-sm text-blue-100">Modules actifs</div>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {systemStats.activeUsers}
              </div>
              <div className="text-sm text-blue-100">Utilisateurs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}
                >
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.suffix || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sections principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div
                    className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-2`}
                  >
                    <IconComponent className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="text-sm font-medium text-gray-900 text-center">
                    {action.name}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {action.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fonctionnalités disponibles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fonctionnalités Disponibles
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {features.length > 0 ? (
              features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <Check className="w-4 h-4 text-green-600 mr-3" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-green-800 capitalize">
                      {feature.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Actif
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Aucune fonctionnalité disponible</p>
                <p className="text-sm">Contactez votre administrateur</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activité récente et modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Activité Récente
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {[
              {
                action: "Document analysé",
                details: "Rapport_fiscal_2024.pdf",
                time: "Il y a 5 minutes",
                icon: FileText,
                color: "text-blue-600",
              },
              {
                action: "Recherche effectuée",
                details: 'Recherche pour "déclaration TVA"',
                time: "Il y a 15 minutes",
                icon: Search,
                color: "text-green-600",
              },
              {
                action: "Workflow démarré",
                details: "Validation documents DGI",
                time: "Il y a 1 heure",
                icon: Workflow,
                color: "text-purple-600",
              },
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <IconComponent className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations système */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            État du Système
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-medium text-gray-900">2.1.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">
                {systemStats.systemUptime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dernière sauvegarde</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Licence expire</span>
                <span className="font-medium text-gray-900">
                  {license?.expiresAt
                    ? new Date(license.expiresAt).toLocaleDateString("fr-FR")
                    : "Jamais"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedApp;
