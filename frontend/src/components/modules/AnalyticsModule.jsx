// Module Analytics & Reporting
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Activity,
  Database,
  Clock,
  Download,
} from "lucide-react";

const AnalyticsModule = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalDocuments: 2847,
    totalSearches: 15283,
    activeUsers: 42,
    systemUptime: 99.7,
    averageProcessingTime: 2.3,
    successRate: 97.8,
  });

  const [timeRange, setTimeRange] = useState("7d");

  const metrics = [
    {
      name: "Documents Traités",
      value: analyticsData.totalDocuments.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Recherches Effectuées",
      value: analyticsData.totalSearches.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Utilisateurs Actifs",
      value: analyticsData.activeUsers,
      change: "+3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Taux de Succès",
      value: `${analyticsData.successRate}%`,
      change: "+1.2%",
      trend: "up",
      icon: TrendingUp,
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
              Analytics & Reporting
            </h1>
            <p className="text-gray-600">
              Analyses détaillées et rapports de performance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">
                  {metric.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'activité */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité sur la Période
          </h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Graphique d'activité</p>
              <p className="text-sm">Données simulées pour la démo</p>
            </div>
          </div>
        </div>

        {/* Types de documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par Type de Document
          </h3>
          <div className="space-y-4">
            {[
              { type: "PDF", count: 1520, percentage: 53 },
              { type: "Word", count: 845, percentage: 30 },
              { type: "Excel", count: 382, percentage: 13 },
              { type: "Images", count: 100, percentage: 4 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performances système */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performances Système
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData.systemUptime}%
            </p>
            <p className="text-sm text-gray-600">Disponibilité</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData.averageProcessingTime}s
            </p>
            <p className="text-sm text-gray-600">Temps de traitement moyen</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Database className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.4 TB</p>
            <p className="text-sm text-gray-600">Données stockées</p>
          </div>
        </div>
      </div>

      {/* Note Beta */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full font-medium">
            BETA
          </span>
          <span className="text-sm text-yellow-700">
            Ce module est en version bêta. Certaines fonctionnalités peuvent
            être limitées.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;
