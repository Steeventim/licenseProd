#!/bin/bash

# Script d'arrêt des services du système de gestion de licences

echo "🛑 Arrêt du système de gestion de licences..."

# Fonction pour arrêter un service
stop_service() {
    local service_name=$1
    local pidfile="logs/${service_name}.pid"
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        echo "🔄 Arrêt de $service_name (PID: $pid)..."
        
        if kill "$pid" 2>/dev/null; then
            echo "✅ $service_name arrêté"
        else
            echo "⚠️  $service_name n'était pas en cours d'exécution ou déjà arrêté"
        fi
        
        rm -f "$pidfile"
    else
        echo "⚠️  Fichier PID non trouvé pour $service_name"
    fi
}

# Arrêter tous les services
if [ -d "logs" ]; then
    for pidfile in logs/*.pid; do
        if [ -f "$pidfile" ]; then
            service=$(basename "$pidfile" .pid)
            stop_service "$service"
        fi
    done
else
    echo "⚠️  Dossier logs non trouvé - aucun service à arrêter"
fi

# Nettoyage des processus Node.js restants sur les ports utilisés
echo "🧹 Nettoyage des processus restants..."

# Fonction pour tuer un processus sur un port spécifique
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo "🔄 Arrêt du processus sur le port $port (PID: $pid)..."
        kill "$pid" 2>/dev/null
    fi
}

# Arrêter les processus sur les ports utilisés
kill_port 3001  # Backend
kill_port 3003  # Frontend
kill_port 3002  # Admin Dashboard

echo ""
echo "✅ Tous les services ont été arrêtés"
echo ""
