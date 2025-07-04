// Interface Client Moderne - Écosystème Unifié de Gestion de Licences
// Design moderne avec Tailwind CSS et architecture modulaire

import React, { useState } from "react";
import { useLicense } from "../hooks/useLicense.jsx";
import { LicenseGuard } from "../components/LicenseGuard";
import { FeatureGuard } from "../components/FeatureGuard";
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
} from "lucide-react";

// Import des composants des modules
const DocumentManager = React.lazy(() => import("./modules/DocumentManager"));
const SearchInterface = React.lazy(() => import("./modules/SearchInterface"));
const BPMInterface = React.lazy(() => import("./modules/BPMInterface"));
const LicenseManager = React.lazy(() => import("./modules/LicenseManager"));

const UnifiedApp = () => {
  const { license, features, loading, error } = useLicense();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [moduleErrors, setModuleErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modules disponibles selon la licence
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
    },
    {
      id: "licenses",
      name: "Gestion des Licences",
      icon: Key,
      description: "Administration des licences et clients",
      requiredFeatures: ["basic"],
      component: LicenseManager,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      id: "documents",
      name: "Gestion Documentaire",
      icon: FileText,
      description: "Workflow et gestion de documents",
      requiredFeatures: ["documents", "bpm"],
      component: DocumentManager,
      url: "http://localhost:3003",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      id: "search",
      name: "Recherche Intelligente",
      icon: Search,
      description: "Moteur de recherche avec IA",
      requiredFeatures: ["search"],
      component: SearchInterface,
      url: "http://localhost:3002",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      id: "bpm",
      name: "Interface BPM",
      icon: Settings,
      description: "Business Process Management",
      requiredFeatures: ["bpm", "workflow"],
      component: BPMInterface,
      url: "http://localhost:5174",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
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
        {/* Header moderne */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo et titre */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Écosystème Unifié
                  </h1>
                </div>
              </div>

              {/* Informations de licence */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{license?.client?.name || "Client"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{features.length} fonctionnalité(s)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {license?.expiresAt
                        ? new Date(license.expiresAt).toLocaleDateString()
                        : "Illimitée"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Actif</span>
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

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Modules Disponibles
              </h3>

              {accessibleModules.map((module) => {
                const IconComponent = module.icon;
                const isActive = activeModule === module.id;

                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModule(module.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${module.gradient} text-white shadow-md`
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                    {module.url && (
                      <ExternalLink
                        className={`w-4 h-4 ml-2 ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              {/* Modules non disponibles */}
              {availableModules.length > accessibleModules.length && (
                <>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3">
                    Non Disponibles
                  </h3>
                  {availableModules
                    .filter((module) => !accessibleModules.includes(module))
                    .map((module) => {
                      const IconComponent = module.icon;

                      return (
                        <div
                          key={module.id}
                          className="flex items-center px-3 py-2 rounded-lg opacity-50 cursor-not-allowed"
                        >
                          <IconComponent className="w-5 h-5 mr-3 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-400">
                              {module.name}
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                              Licence insuffisante
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
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
      return (
        <FeatureGuard feature={module.requiredFeatures?.[0]}>
          <Component />
        </FeatureGuard>
      );
    }
  }
};

// Composant pour les modules externes
const ExternalModuleWrapper = ({ module, onError }) => {
  const [loading, setLoading] = useState(false);
  const { license } = useLicense();

  const openInNewTab = () => {
    const url = `${module.url}?licenseKey=${license?.key}&client=${license?.client?.id}`;
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

// Module Dashboard moderne
const DashboardModule = () => {
  const { license, features } = useLicense();

  const stats = [
    {
      name: "Licence Active",
      value: license?.client?.name || "Non défini",
      icon: Key,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Fonctionnalités",
      value: features.length,
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Statut",
      value: "Actif",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Expiration",
      value: license?.expiresAt
        ? new Date(license.expiresAt).toLocaleDateString()
        : "Jamais",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tableau de Bord
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble de votre écosystème de gestion de licences
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">
              Système opérationnel
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fonctionnalités disponibles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fonctionnalités Disponibles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <Check className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800 capitalize">
                {feature}
              </span>
            </div>
          ))}
        </div>
        {features.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Aucune fonctionnalité disponible avec votre licence actuelle
          </p>
        )}
      </div>

      {/* Modules rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Accès Rapide aux Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Licences",
              icon: Key,
              color: "text-green-600",
              bgColor: "bg-green-50",
            },
            {
              name: "Documents",
              icon: FileText,
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
            {
              name: "Recherche",
              icon: Search,
              color: "text-orange-600",
              bgColor: "bg-orange-50",
            },
          ].map((module, index) => {
            const IconComponent = module.icon;
            return (
              <div
                key={index}
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div
                  className={`w-10 h-10 ${module.bgColor} rounded-lg flex items-center justify-center mr-3`}
                >
                  <IconComponent className={`w-5 h-5 ${module.color}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{module.name}</p>
                  <p className="text-sm text-gray-500">Accéder au module</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UnifiedApp;
