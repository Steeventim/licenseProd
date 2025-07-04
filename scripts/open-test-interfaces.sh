#!/bin/bash

# Script pour ouvrir automatiquement toutes les interfaces dans le navigateur
# Facilite les tests visuels de l'écosystème unifié

echo "🚀 Ouverture des interfaces de test visuel..."
echo "================================================"

# Configuration des URLs
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:5173"
SEARCH_ENGINE_URL="http://localhost:3002"
BACKBPMF_URL="http://localhost:3003"
FRONTBPMF_URL="http://localhost:5174"
ADMIN_DASHBOARD_URL="http://localhost:8080"

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonction pour ouvrir une URL dans le navigateur
open_url() {
    local url=$1
    local name=$2
    
    log_info "Ouverture de $name: $url"
    
    # Détecter le navigateur disponible
    if command -v google-chrome >/dev/null 2>&1; then
        google-chrome "$url" &
    elif command -v firefox >/dev/null 2>&1; then
        firefox "$url" &
    elif command -v chromium-browser >/dev/null 2>&1; then
        chromium-browser "$url" &
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$url" &
    else
        log_warning "Aucun navigateur détecté. Ouvrez manuellement: $url"
    fi
    
    sleep 1
}

# Vérifier si les services sont démarrés
log_info "Vérification de l'état des services..."

services_ready=true

# Vérifier chaque service
for service_url in "$BACKEND_URL/health" "$FRONTEND_URL" "$SEARCH_ENGINE_URL" "$BACKBPMF_URL/health" "$FRONTBPMF_URL" "$ADMIN_DASHBOARD_URL"; do
    if ! curl -s "$service_url" >/dev/null 2>&1; then
        services_ready=false
        break
    fi
done

if [ "$services_ready" = false ]; then
    log_warning "Certains services ne sont pas démarrés."
    log_info "Démarrage automatique des services..."
    ./start-all-services.sh &
    log_info "Attente de 15 secondes pour le démarrage..."
    sleep 15
fi

# Ouvrir toutes les interfaces de test
echo ""
log_info "=== OUVERTURE DES INTERFACES DE TEST ==="

# 1. Backend API (Health Check)
open_url "${BACKEND_URL}/health" "Backend API Health"

# 2. Admin Dashboard
open_url "$ADMIN_DASHBOARD_URL" "Admin Dashboard"

# 3. Frontend Principal
open_url "$FRONTEND_URL" "Frontend Principal"

# 4. Search Engine
open_url "$SEARCH_ENGINE_URL" "Search Engine"

# 5. BackBPMF Health
open_url "${BACKBPMF_URL}/health" "BackBPMF Health"

# 6. FrontBPMF
open_url "$FRONTBPMF_URL" "FrontBPMF"

sleep 2

# Informations pour les tests
echo ""
log_info "=== INFORMATIONS DE TEST ==="
echo "📋 Toutes les interfaces sont ouvertes dans votre navigateur"
echo ""
echo "🔑 Pour obtenir une licence de test :"
echo "LICENSE_KEY=\$(curl -s 'http://localhost:3001/api/clients' | jq -r '.clients[0].licenses[0].key')"
echo ""
echo "📖 Guide de test détaillé : VISUAL_TESTING_WORKFLOW.md"
echo ""
log_success "Interfaces prêtes pour les tests visuels!"

# Optionnel : afficher les logs en temps réel
read -p "Voulez-vous afficher les logs en temps réel ? (y/N): " show_logs
if [[ $show_logs =~ ^[Yy]$ ]]; then
    log_info "Affichage des logs en temps réel..."
    echo "Appuyez sur Ctrl+C pour arrêter"
    
    # Créer des logs si ils n'existent pas
    mkdir -p logs
    touch logs/backend.log logs/BackBPMF.log logs/SearchEngine.log logs/frontend.log
    
    # Afficher les logs
    tail -f logs/*.log
fi
