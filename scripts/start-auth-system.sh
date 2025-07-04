#!/bin/bash

# Script de démarrage pour le système d'authentification Admin Dashboard
# Démarre le backend et l'admin dashboard avec authentification

echo "🔐 Démarrage du système d'authentification Admin Dashboard..."
echo ""

# Vérifier les dépendances
check_service() {
    local name=$1
    local port=$2
    
    if netstat -tuln | grep -q ":$port "; then
        echo "⚠️  Le port $port est déjà utilisé par $name"
        return 1
    fi
    return 0
}

# Vérifier que les ports sont libres
echo "🔍 Vérification des ports..."
check_service "Backend API" 3001
check_service "Admin Dashboard" 8080

echo ""
echo "📁 Dossier de travail : $(pwd)"
echo ""

# Fonction pour démarrer un service en arrière-plan
start_service() {
    local name=$1
    local dir=$2
    local command=$3
    local port=$4
    local log_file="/home/tims/Dev/Licenses_prod/logs/${name}.log"
    local pid_file="/home/tims/Dev/Licenses_prod/logs/${name}.pid"
    
    echo "🚀 Démarrage de $name..."
    
    # Créer le dossier logs s'il n'existe pas
    mkdir -p /home/tims/Dev/Licenses_prod/logs
    
    # Démarrer le service
    cd "$dir"
    nohup $command > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "$pid_file"
    
    echo "   PID: $pid"
    echo "   Log: $log_file"
    
    # Attendre que le service démarre
    echo "   Attente du démarrage..."
    sleep 5
    
    # Vérifier que le service est démarré
    if netstat -tuln | grep -q ":$port "; then
        echo "   ✅ $name démarré avec succès sur le port $port"
    else
        echo "   ❌ Échec du démarrage de $name"
        return 1
    fi
    
    cd - > /dev/null
    return 0
}

# Démarrer le backend
echo "1️⃣  Backend API (Authentification)..."
if start_service "Backend-Auth" "/home/tims/Dev/Licenses_prod/backend" "npm run dev" 3001; then
    echo ""
else
    echo "❌ Impossible de démarrer le backend"
    exit 1
fi

# Démarrer l'admin dashboard
echo "2️⃣  Admin Dashboard (Interface)..."
if start_service "Admin-Dashboard" "/home/tims/Dev/Licenses_prod/admin-dashboard" "npm run dev" 8080; then
    echo ""
else
    echo "❌ Impossible de démarrer l'admin dashboard"
    exit 1
fi

# Afficher le résumé
echo "🎉 SYSTÈME D'AUTHENTIFICATION DÉMARRÉ AVEC SUCCÈS !"
echo ""
echo "📋 SERVICES ACTIFS :"
echo "   🔧 Backend API        : http://localhost:3001"
echo "   🖥️  Admin Dashboard    : http://localhost:8080"
echo ""
echo "🔐 IDENTIFIANTS DE CONNEXION :"
echo "   👤 Nom d'utilisateur : Faubell7"
echo "   🔑 Mot de passe      : Z04y627$"
echo ""
echo "🌐 ACCÈS DIRECT :"
echo "   Interface Admin : http://localhost:8080"
echo ""
echo "📊 VÉRIFICATION DES SERVICES :"
netstat -tuln | grep -E ':(3001|8080)' | while read line; do
    if echo "$line" | grep -q ":3001"; then
        echo "   ✅ Backend API actif"
    elif echo "$line" | grep -q ":8080"; then
        echo "   ✅ Admin Dashboard actif"
    fi
done
echo ""
echo "📝 LOGS DES SERVICES :"
echo "   Backend     : /home/tims/Dev/Licenses_prod/logs/Backend-Auth.log"
echo "   Dashboard   : /home/tims/Dev/Licenses_prod/logs/Admin-Dashboard.log"
echo ""
echo "🛑 POUR ARRÊTER LES SERVICES :"
echo "   ./stop-all-services.sh"
echo ""
echo "✨ Le système est prêt à être utilisé !"
