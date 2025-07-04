#!/bin/bash

# Script de test interactif pour les interfaces visuelles
# Guide l'utilisateur à travers les tests pas à pas

set -e

echo "🎯 Test Interactif des Interfaces Visuelles"
echo "========================================="
echo ""

# Configuration
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:5173"
SEARCH_ENGINE_URL="http://localhost:3002"
BACKBPMF_URL="http://localhost:3003"
FRONTBPMF_URL="http://localhost:5174"
ADMIN_DASHBOARD_URL="http://localhost:8080"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Fonction pour attendre la confirmation de l'utilisateur
wait_for_user() {
    echo ""
    read -p "Appuyez sur Entrée pour continuer..."
    echo ""
}

# Fonction pour demander si un test a réussi
ask_test_result() {
    local test_name="$1"
    echo ""
    while true; do
        read -p "✅ Le test '$test_name' a-t-il réussi ? (o/n): " yn
        case $yn in
            [Oo]* ) log_success "Test '$test_name' : RÉUSSI"; return 0;;
            [Nn]* ) log_error "Test '$test_name' : ÉCHOUÉ"; return 1;;
            * ) echo "Répondez oui (o) ou non (n).";;
        esac
    done
}

# Fonction pour obtenir une licence de test
get_test_license() {
    log_info "Récupération d'une licence de test..."
    LICENSE_KEY=$(curl -s 'http://localhost:3001/api/clients' | jq -r '.clients[0].licenses[0].key' 2>/dev/null || echo "")
    if [ -n "$LICENSE_KEY" ] && [ "$LICENSE_KEY" != "null" ]; then
        log_success "Licence de test obtenue: ${LICENSE_KEY:0:20}..."
        echo "🔑 Votre licence de test :"
        echo "LICENSE_KEY=\"$LICENSE_KEY\""
    else
        log_error "Impossible d'obtenir une licence de test"
        return 1
    fi
}

echo "Ce script va vous guider à travers les tests visuels de toutes les interfaces."
echo "Assurez-vous que tous les services sont démarrés avant de continuer."
echo ""

# Vérification des prérequis
log_info "Vérification des services..."
if ! curl -s "$BACKEND_URL/health" >/dev/null 2>&1; then
    log_warning "Backend API non disponible. Démarrage automatique..."
    ./start-all-services.sh &
    sleep 10
fi

# Obtenir une licence de test
get_test_license || exit 1

echo ""
echo "================================================="
echo "🚀 DÉBUT DES TESTS VISUELS INTERACTIFS"
echo "================================================="

# TEST 1: Backend API
echo ""
log_info "=== TEST 1: Backend API (Administration) ==="
echo "📍 URL: $BACKEND_URL/health"
echo ""
echo "Instructions :"
echo "1. Ouvrez votre navigateur sur : $BACKEND_URL/health"
echo "2. Vérifiez que vous voyez : {\"status\":\"ok\",\"timestamp\":\"...\"}"
echo "3. Testez aussi : $BACKEND_URL/api/clients"

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$BACKEND_URL/health" &
    sleep 2
fi

wait_for_user
ask_test_result "Backend API Health Check" || log_warning "Problème détecté avec Backend API"

# TEST 2: Admin Dashboard
echo ""
log_info "=== TEST 2: Admin Dashboard ==="
echo "📍 URL: $ADMIN_DASHBOARD_URL"
echo ""
echo "Instructions :"
echo "1. Ouvrez votre navigateur sur : $ADMIN_DASHBOARD_URL"
echo "2. Vérifiez que l'interface d'administration se charge"
echo "3. Naviguez dans les menus"
echo "4. Vérifiez que les données de licence sont visibles"

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$ADMIN_DASHBOARD_URL" &
    sleep 2
fi

wait_for_user
ask_test_result "Admin Dashboard Interface" || log_warning "Problème détecté avec Admin Dashboard"

# TEST 3: Frontend Principal
echo ""
log_info "=== TEST 3: Frontend Principal (React + License Guard) ==="
echo "📍 URL: $FRONTEND_URL"
echo ""
echo "Instructions :"
echo "1. Ouvrez votre navigateur sur : $FRONTEND_URL"
echo "2. Ouvrez les DevTools (F12) pour voir les logs"
echo "3. Vérifiez que le composant LicenseGuard fonctionne"
echo "4. Testez la navigation entre les sections"
echo "5. Vérifiez que les fonctionnalités sont protégées selon la licence"

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$FRONTEND_URL" &
    sleep 2
fi

echo ""
echo "🔍 Points à vérifier :"
echo "   ✓ Page se charge sans erreur"
echo "   ✓ Message de statut de licence affiché"
echo "   ✓ Navigation fonctionne"
echo "   ✓ Console DevTools sans erreurs critiques"

wait_for_user
ask_test_result "Frontend Principal - Interface" || log_warning "Problème détecté avec Frontend Principal"

# TEST 4: Search Engine
echo ""
log_info "=== TEST 4: Search Engine (Next.js + Middleware) ==="
echo "📍 URL: $SEARCH_ENGINE_URL"
echo ""
echo "Instructions :"
echo "1. Ouvrez votre navigateur sur : $SEARCH_ENGINE_URL"
echo "2. Testez l'interface de recherche"
echo "3. Effectuez une recherche (ex: 'test')"
echo "4. Vérifiez que les résultats s'affichent ou que l'erreur de licence est claire"

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$SEARCH_ENGINE_URL" &
    sleep 2
fi

echo ""
echo "🔍 Points à vérifier :"
echo "   ✓ Interface de recherche visible"
echo "   ✓ Formulaire de recherche fonctionne"
echo "   ✓ Middleware de licence actif (vérifier Network tab)"
echo "   ✓ Résultats ou erreur de licence cohérente"

wait_for_user
ask_test_result "Search Engine - Interface" || log_warning "Problème détecté avec Search Engine"

# TEST 5: BackBPMF API
echo ""
log_info "=== TEST 5: BackBPMF API (Fastify + Middleware) ==="
echo "📍 URL: $BACKBPMF_URL/health"
echo ""
echo "Instructions :"
echo "1. Ouvrez votre navigateur sur : $BACKBPMF_URL/health"
echo "2. Vérifiez que l'API répond"
echo "3. Testez l'API avec curl :"

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$BACKBPMF_URL/health" &
    sleep 2
fi

echo ""
echo "🔧 Test API avec licence :"
echo "curl -H \"Authorization: Bearer $LICENSE_KEY\" \"$BACKBPMF_URL/api/documents\""
echo ""
echo "🔧 Test API sans licence :"
echo "curl \"$BACKBPMF_URL/api/documents\""

wait_for_user
ask_test_result "BackBPMF API - Health & Protection" || log_warning "Problème détecté avec BackBPMF"

# TEST 6: FrontBPMF
echo ""
log_info "=== TEST 6: FrontBPMF (React + License Provider) ==="
echo "📍 URL: $FRONTBPMF_URL"
echo ""
echo "Instructions :"
echo "1. Ouvrez votre navigateur sur : $FRONTBPMF_URL"
echo "2. Vérifiez que l'interface BPM se charge"
echo "3. Testez les modules BPM (documents, processus)"
echo "4. Vérifiez la communication avec BackBPMF"
echo "5. Observez les requêtes dans Network tab (DevTools)"

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$FRONTBPMF_URL" &
    sleep 2
fi

echo ""
echo "🔍 Points à vérifier :"
echo "   ✓ Interface BPM se charge"
echo "   ✓ LicenseProvider initialisé"
echo "   ✓ Communication avec BackBPMF (port 3003)"
echo "   ✓ Fonctionnalités BPM accessibles selon la licence"

wait_for_user
ask_test_result "FrontBPMF - Interface BPM" || log_warning "Problème détecté avec FrontBPMF"

# TEST 7: Intégration complète
echo ""
log_info "=== TEST 7: Workflow d'Intégration Complète ==="
echo ""
echo "Instructions pour le test de bout en bout :"
echo "1. 🏠 Commencez sur le Frontend Principal ($FRONTEND_URL)"
echo "2. 🔍 Utilisez la fonction de recherche (doit rediriger vers Search Engine)"
echo "3. 📋 Sélectionnez un résultat et demandez un traitement BPM"
echo "4. 🎯 Vérifiez la redirection vers FrontBPMF"
echo "5. ⚙️  Créez un processus BPM à partir du document"
echo "6. 📊 Retournez sur Admin Dashboard pour voir les logs"

echo ""
echo "🔄 Scénario de test complet :"
echo "   Frontend → Search → BPM → Admin"

wait_for_user
ask_test_result "Workflow d'Intégration Complète" || log_warning "Problème dans le workflow complet"

# RÉSUMÉ DES TESTS
echo ""
echo "================================================="
echo "📊 RÉSUMÉ DES TESTS VISUELS"
echo "================================================="

total_tests=7
echo "Tests effectués : $total_tests"
echo ""
echo "🔗 URLs testées :"
echo "   • Backend API: $BACKEND_URL"
echo "   • Admin Dashboard: $ADMIN_DASHBOARD_URL"
echo "   • Frontend Principal: $FRONTEND_URL"
echo "   • Search Engine: $SEARCH_ENGINE_URL"
echo "   • BackBPMF API: $BACKBPMF_URL"
echo "   • FrontBPMF: $FRONTBPMF_URL"

echo ""
echo "🔑 Licence de test utilisée :"
echo "LICENSE_KEY=\"$LICENSE_KEY\""

echo ""
echo "📋 Documentation complète :"
echo "   📖 Guide détaillé : VISUAL_TESTING_WORKFLOW.md"

echo ""
log_info "🎉 Tests visuels terminés !"
echo "Pour des tests automatisés, utilisez : ./test-unified-ecosystem-complete.sh"

# Optionnel : ouvrir le guide de documentation
read -p "Voulez-vous ouvrir le guide de test détaillé ? (y/N): " open_guide
if [[ $open_guide =~ ^[Yy]$ ]]; then
    if command -v code >/dev/null 2>&1; then
        code VISUAL_TESTING_WORKFLOW.md
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open VISUAL_TESTING_WORKFLOW.md
    else
        echo "Ouvrez manuellement : VISUAL_TESTING_WORKFLOW.md"
    fi
fi

echo ""
log_success "Tests visuels complets ! 🚀"
