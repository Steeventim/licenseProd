#!/bin/bash

# Script d'arrêt coordonné de tous les services
# Arrête proprement le système principal + les nouveaux modules

echo "🛑 Arrêt coordonné de tous les services..."

# Fonction pour arrêter un service via son fichier PID
stop_service() {
    local name=$1
    local pid_file="/home/tims/Dev/Licenses_prod/logs/${name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔄 Arrêt de $name (PID: $pid)..."
            kill $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚠️  Arrêt forcé de $name..."
                kill -9 $pid
            fi
            rm -f "$pid_file"
            echo "✅ $name arrêté"
        else
            echo "⚠️  $name n'était pas en cours d'exécution"
            rm -f "$pid_file"
        fi
    else
        echo "ℹ️  Aucun fichier PID trouvé pour $name"
    fi
}

# 1. Arrêter le système principal de gestion de licences
echo "1️⃣  Arrêt du système principal de gestion de licences..."
if [ -f "/home/tims/Dev/Licenses_prod/stop.sh" ]; then
    cd /home/tims/Dev/Licenses_prod
    ./stop.sh
else
    echo "⚠️  Script stop.sh principal introuvable"
    # Arrêt manuel des services principaux
    stop_service "Backend API"
    stop_service "Admin Dashboard"
    stop_service "Frontend Client"
fi

# 2. Arrêter BackBPMF
echo ""
echo "2️⃣  Arrêt de BackBPMF..."
stop_service "BackBPMF"

# 3. Arrêter FrontBPMF
echo ""
echo "3️⃣  Arrêt de FrontBPMF..."
stop_service "FrontBPMF"

# 4. Arrêter Search Engine
echo ""
echo "4️⃣  Arrêt du Search Engine..."
stop_service "SearchEngine"

# Vérification finale - tuer tous les processus Node.js restants sur les ports connus
echo ""
echo "🔍 Vérification finale des processus..."

# Ports mis à jour selon la configuration actuelle
ports=(3001 3000 3003 5173 5174 8080)
for port in "${ports[@]}"; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "⚠️  Processus restant sur le port $port (PID: $pid) - arrêt forcé"
        kill -9 $pid 2>/dev/null
        sleep 1
        # Vérifier si le processus est vraiment arrêté
        if lsof -ti:$port 2>/dev/null >/dev/null; then
            echo "❌ Impossible d'arrêter le processus sur le port $port"
        else
            echo "✅ Processus sur le port $port arrêté avec succès"
        fi
    fi
done

# Nettoyer les fichiers PID orphelins
echo "🧹 Nettoyage des fichiers PID..."
rm -f /home/tims/Dev/Licenses_prod/logs/*.pid

# Vérification finale de l'état des ports
echo ""
echo "📊 VÉRIFICATION FINALE :"
echo "------------------------"

services=(
    "Backend API (Licences):3001"
    "Search Engine (IA):3000" 
    "BackBPMF (Documents DGI):3003"
    "Frontend Client (Interface):5173"
    "FrontBPMF (BPM):5174"
    "Admin Dashboard:8080"
)

all_stopped=true
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if netstat -tuln | grep -q ":$port "; then
        echo "⚠️  $name - Toujours actif sur le port $port"
        all_stopped=false
    else
        echo "✅ $name - Arrêté"
    fi
done

echo ""
if [ "$all_stopped" = true ]; then
    echo "🎉 Tous les services ont été arrêtés avec succès !"
else
    echo "⚠️  Certains services sont encore actifs. Vérifiez manuellement avec :"
    echo "   netstat -tuln | grep -E ':(3001|3000|3003|5173|5174|8080) '"
    echo "   ps aux | grep node"
    echo ""
    echo "🔧 Pour forcer l'arrêt des services restants :"
    echo "   sudo lsof -ti:PORT | xargs kill -9  (remplacez PORT par le port)"
    echo "   ou relancez ce script : ./stop-all-services.sh"
fi

echo ""
echo "📋 SERVICES DISPONIBLES POUR REDÉMARRAGE :"
echo "  ./start-all-services.sh  - Démarrer tous les services"
echo "  ./start.sh              - Démarrer uniquement le système principal"
