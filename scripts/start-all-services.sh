#!/bin/bash

# ========================================
# SCRIPT DE DÉMARRAGE UNIFIÉ - ÉCOSYSTÈME COMPLET
# Version 3.0 - Tous les services intégrés
# ========================================

echo "🚀 Démarrage de l'écosystème complet de gestion de licences..."
echo ""

# Variables globales
WORKSPACE_DIR="/home/tims/Dev/Licenses_prod"
LOGS_DIR="$WORKSPACE_DIR/logs"
FAILED_SERVICES=()
STARTED_SERVICES=()

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage coloré
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success") echo -e "${GREEN}✅ $message${NC}" ;;
        "error") echo -e "${RED}❌ $message${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  $message${NC}" ;;
        *) echo "$message" ;;
    esac
}

# Fonction pour vérifier si un port est libre
check_port() {
    local port=$1
    local service_name=$2
    if netstat -tuln | grep -q ":$port "; then
        print_status "warning" "Port $port déjà utilisé par $service_name"
        return 1
    fi
    return 0
}

# Fonction pour attendre qu'un service soit prêt
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=0
    
    echo "   Attente du démarrage de $service_name sur le port $port..."
    while [ $attempt -lt $max_attempts ]; do
        if netstat -tuln | grep -q ":$port "; then
            print_status "success" "$service_name démarré avec succès sur le port $port"
            return 0
        fi
        sleep 1
        ((attempt++))
    done
    
    print_status "error" "Timeout: $service_name n'a pas démarré sur le port $port"
    return 1
}

# Fonction principale pour démarrer un service
start_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3
    local start_command=$4
    local description=$5
    
    echo ""
    echo "🔄 Démarrage de $service_name..."
    print_status "info" "$description"
    
    # Vérifier si le service est déjà actif
    if netstat -tuln | grep -q ":$port "; then
        print_status "warning" "$service_name déjà actif sur le port $port"
        STARTED_SERVICES+=("$service_name:$port:ALREADY_RUNNING")
        return 0
    fi
    
    # Vérifier que le dossier existe
    if [ ! -d "$service_dir" ]; then
        print_status "error" "Dossier $service_dir introuvable"
        FAILED_SERVICES+=("$service_name:DIRECTORY_NOT_FOUND")
        return 1
    fi
    
    # Créer le dossier logs s'il n'existe pas
    mkdir -p "$LOGS_DIR"
    
    local log_file="$LOGS_DIR/${service_name}.log"
    local pid_file="$LOGS_DIR/${service_name}.pid"
    
    # Aller dans le dossier du service
    cd "$service_dir"
    
    # Vérifier package.json
    if [ ! -f "package.json" ]; then
        print_status "error" "package.json non trouvé dans $service_dir"
        FAILED_SERVICES+=("$service_name:NO_PACKAGE_JSON")
        return 1
    fi
    
    # Installer les dépendances si nécessaire
    if [ ! -d "node_modules" ]; then
        echo "   📦 Installation des dépendances..."
        npm install --silent
    fi
    
    # Démarrer le service
    if [[ $start_command == *"PORT="* ]]; then
        # Commande avec PORT spécifique
        nohup bash -c "$start_command" > "$log_file" 2>&1 &
    else
        # Commande normale avec export PORT
        export PORT=$port
        nohup $start_command > "$log_file" 2>&1 &
    fi
    
    local pid=$!
    echo $pid > "$pid_file"
    
    echo "   PID: $pid"
    echo "   Log: $log_file"
    
    # Attendre que le service démarre
    if wait_for_service $port "$service_name"; then
        STARTED_SERVICES+=("$service_name:$port:STARTED")
        return 0
    else
        FAILED_SERVICES+=("$service_name:STARTUP_FAILED")
        return 1
    fi
}

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_status "error" "Node.js n'est pas installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_status "error" "npm n'est pas installé"
    exit 1
fi

echo "   ✅ Node.js $(node --version)"
echo "   ✅ npm $(npm --version)"

# Aller dans le dossier de travail
cd "$WORKSPACE_DIR"

echo ""
echo "📋 DÉMARRAGE DES SERVICES DE L'ÉCOSYSTÈME..."
echo "============================================="
# ==========================================
# 1. BACKEND API - Système de gestion des licences
# ==========================================
start_service "Backend-API" \
    "$WORKSPACE_DIR/backend" \
    "3001" \
    "npm run dev" \
    "API de gestion des licences et authentification"

# ==========================================
# 2. ADMIN DASHBOARD - Interface d'administration
# ==========================================
start_service "Admin-Dashboard" \
    "$WORKSPACE_DIR/admin-dashboard" \
    "8080" \
    "npm run dev" \
    "Interface d'administration avec authentification"

# ==========================================
# 3. FRONTEND CLIENT - Interface utilisateur principale
# ==========================================
start_service "Frontend-Client" \
    "$WORKSPACE_DIR/frontend" \
    "5173" \
    "npm run dev" \
    "Interface client moderne avec modules intégrés"

# ==========================================
# 4. SEARCH ENGINE - Moteur de recherche intelligent
# ==========================================
start_service "SearchEngine" \
    "$WORKSPACE_DIR/search-engine" \
    "3000" \
    "npm run dev" \
    "Moteur de recherche avec IA et analyse de documents"

# ==========================================
# 5. BACKBPMF - Système de gestion documentaire DGI
# ==========================================
start_service "BackBPMF" \
    "$WORKSPACE_DIR/BackBPMF" \
    "3003" \
    "npm run dev" \
    "Backend de gestion documentaire pour workflow DGI"

# Alternative pour BackBPMF si le port 3003 est occupé
if [[ " ${FAILED_SERVICES[@]} " =~ " BackBPMF" ]]; then
    echo "🔄 Tentative de démarrage de BackBPMF sur le port 3004..."
    start_service "BackBPMF-Alt" \
        "$WORKSPACE_DIR/BackBPMF" \
        "3004" \
        "PORT=3004 npm run dev" \
        "Backend documentaire DGI (port alternatif)"
fi

# ==========================================
# 6. FRONTBPMF - Interface BPM
# ==========================================
start_service "FrontBPMF" \
    "$WORKSPACE_DIR/FrontBPMF" \
    "5174" \
    "npm run dev" \
    "Interface Business Process Management"

# ==========================================
# ATTENTE ET VÉRIFICATION
# ==========================================
echo ""
echo "⏳ Attente de la stabilisation des services..."
sleep 5

echo ""
echo "📊 RAPPORT DE DÉMARRAGE"
echo "======================="

# Affichage des services démarrés avec succès
if [ ${#STARTED_SERVICES[@]} -gt 0 ]; then
    echo ""
    print_status "success" "SERVICES DÉMARRÉS AVEC SUCCÈS :"
    for service in "${STARTED_SERVICES[@]}"; do
        IFS=':' read -r name port status <<< "$service"
        if [ "$status" = "ALREADY_RUNNING" ]; then
            echo "   ✅ $name - http://localhost:$port (déjà actif)"
        else
            echo "   ✅ $name - http://localhost:$port"
        fi
    done
fi

# Affichage des services en échec
if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
    echo ""
    print_status "error" "SERVICES EN ÉCHEC :"
    for service in "${FAILED_SERVICES[@]}"; do
        echo "   ❌ $service"
    done
fi

# Vérification finale des ports
echo ""
echo "🔍 VÉRIFICATION FINALE DES PORTS :"
echo "-----------------------------------"

declare -A expected_services=(
    ["3001"]="Backend API (Licences)"
    ["3000"]="Search Engine (IA)"
    ["3003"]="BackBPMF (Documents DGI)"
    ["3004"]="BackBPMF Alt (Documents DGI)"
    ["5173"]="Frontend Client (Interface)"
    ["5174"]="FrontBPMF (BPM)"
    ["8080"]="Admin Dashboard"
)

for port in "${!expected_services[@]}"; do
    if netstat -tuln | grep -q ":$port "; then
        print_status "success" "${expected_services[$port]} - http://localhost:$port"
    else
        print_status "error" "${expected_services[$port]} - Service non disponible"
    fi
done

# ==========================================
# INFORMATIONS FINALES
# ==========================================
echo ""
echo "🎯 MODES DE DÉMARRAGE DISPONIBLES"
echo "=================================="
echo ""
echo "📱 ACCÈS COMPLET (tous services) :"
echo "   └─ Interface Client: http://localhost:5173"
echo "      ├─ Tableaux de bord et analytics"
echo "      ├─ Gestion documentaire (BackBPMF)"
echo "      ├─ Recherche intelligente (IA)"
echo "      ├─ Interface BPM"
echo "      └─ Export et rapports"
echo ""
echo "🔧 ADMINISTRATION :"
echo "   └─ Admin Dashboard: http://localhost:8080"
echo "      ├─ Login: Faubell7 / Z04y627$"
echo "      ├─ Gestion des clients"
echo "      ├─ Gestion des licences"
echo "      └─ Statistiques système"
echo ""
echo "🔗 SERVICES DIRECTS :"
echo "   ├─ API Backend: http://localhost:3001"
echo "   ├─ Search Engine: http://localhost:3000"
echo "   ├─ Documents DGI: http://localhost:3003"
echo "   └─ Interface BPM: http://localhost:5174"
echo ""

# Détection automatique de l'environnement
active_services=$(netstat -tuln | grep -E ':(3001|3000|3003|5173|5174|8080)' | wc -l)

if [ $active_services -ge 4 ]; then
    echo "🎉 ÉCOSYSTÈME OPÉRATIONNEL !"
    echo ""
    echo "🔑 VALIDATION DE LICENCE :"
    echo "   Clé de test : LIC-MCDMX42E-00F4248D-7C3B859A-F12E63D8"
    echo "   Fonctionnalités : basic, bpm, search, export, analytics, reports, documents"
    echo ""
    echo "📋 COMMANDES UTILES :"
    echo "   • Voir les logs : tail -f logs/[service].log"
    echo "   • Arrêter tous : ./stop-all-services.sh"
    echo "   • Test complet : http://localhost:5173/test-license-interface.html"
    echo "   • Test avancé : open test-all-features.html"
    echo ""
    echo "📧 SUPPORT : Tous les services sont maintenant accessibles avec validation de licence !"
else
    echo "⚠️  DÉMARRAGE PARTIEL"
    echo "   Certains services ne sont pas disponibles."
    echo "   Vérifiez les logs dans le dossier ./logs/"
    echo ""
    echo "🔧 DÉPANNAGE :"
    echo "   • Relancer : ./start-all-services.sh"
    echo "   • Arrêter d'abord : ./stop-all-services.sh"
    echo "   • Vérifier les ports : netstat -tuln | grep -E ':(3001|3000|3003|5173|5174|8080)'"
fi

echo ""
echo "💫 Démarrage de l'écosystème terminé - $(date)"
