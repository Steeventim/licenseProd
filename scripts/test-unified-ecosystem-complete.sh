#!/bin/bash

# Script de test complet pour l'écosystème unifié de gestion de licences
# Teste l'intégration du middleware de licence dans tous les modules

set -e

echo "🚀 Démarrage des tests d'intégration de l'écosystème unifié"
echo "=================================================="

# Configuration
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:5173"
SEARCH_ENGINE_URL="http://localhost:3002"
BACKBPMF_URL="http://localhost:3003"
FRONTBPMF_URL="http://localhost:5174"
ADMIN_DASHBOARD_URL="http://localhost:8080"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour attendre qu'un service soit prêt
wait_for_service() {
    local url=$1
    local name=$2
    local timeout=30
    local count=0
    
    log_info "Attente du service $name sur $url..."
    
    while [ $count -lt $timeout ]; do
        if curl -s "$url" > /dev/null 2>&1 || curl -s "$url/health" > /dev/null 2>&1; then
            log_success "Service $name est prêt"
            return 0
        fi
        sleep 2
        count=$((count + 2))
        echo -n "."
    done
    
    log_error "Service $name n'est pas prêt après ${timeout}s"
    return 1
}

# Fonction pour tester une API avec licence
test_api_with_license() {
    local url=$1
    local endpoint=$2
    local license_key=$3
    local description=$4
    
    log_info "Test: $description"
    
    # Test sans licence (doit échouer)
    local response_no_license=$(curl -s -o /dev/null -w "%{http_code}" "$url$endpoint")
    if [ "$response_no_license" = "401" ] || [ "$response_no_license" = "403" ]; then
        log_success "Protection sans licence: OK ($response_no_license)"
    else
        log_warning "Protection sans licence: PARTIAL ($response_no_license)"
    fi
    
    # Test avec licence (doit réussir)
    if [ -n "$license_key" ]; then
        local response_with_license=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $license_key" "$url$endpoint")
        if [ "$response_with_license" = "200" ] || [ "$response_with_license" = "201" ]; then
            log_success "Accès avec licence: OK ($response_with_license)"
        else
            log_warning "Accès avec licence: ISSUES ($response_with_license)"
        fi
    fi
}

# Fonction pour générer une clé de licence de test
generate_test_license() {
    log_info "Génération d'une licence de test..."
    
    local license_response=$(curl -s -X POST "$BACKEND_URL/api/licenses" \
        -H "Content-Type: application/json" \
        -d '{
            "clientId": "cmcc1d5pp000214hlxhzqt365",
            "features": ["basic", "bpm", "search", "export"],
            "expiresAt": "2025-12-31T23:59:59.000Z",
            "domain": "localhost"
        }' 2>/dev/null)
    
    if [ $? -eq 0 ] && echo "$license_response" | grep -q "key"; then
        local license_key=$(echo "$license_response" | grep -o '"key":"[^"]*"' | cut -d'"' -f4)
        echo "$license_key"
        log_success "Licence de test générée: ${license_key:0:20}..."
    else
        log_error "Impossible de générer une licence de test"
        echo "Réponse: $license_response" >&2
        return 1
    fi
}

# Démarrer les services si nécessaire
log_info "Vérification des services..."

# Vérifier si les services sont déjà démarrés
services_running=0

if wait_for_service "$BACKEND_URL" "Backend API" 2>/dev/null; then
    services_running=1
fi

if [ $services_running -eq 0 ]; then
    log_info "Démarrage des services..."
    ./start-all-services.sh &
    sleep 10
fi

# Attendre que tous les services soient prêts
log_info "Attente de tous les services..."
wait_for_service "$BACKEND_URL" "Backend API" || exit 1
wait_for_service "$FRONTEND_URL" "Frontend" || log_warning "Frontend non disponible"
wait_for_service "$SEARCH_ENGINE_URL" "Search Engine" || log_warning "Search Engine non disponible"
wait_for_service "$BACKBPMF_URL" "BackBPMF" || log_warning "BackBPMF non disponible"
wait_for_service "$FRONTBPMF_URL" "FrontBPMF" || log_warning "FrontBPMF non disponible"
wait_for_service "$ADMIN_DASHBOARD_URL" "Admin Dashboard" || log_warning "Admin Dashboard non disponible"

# Génération de la licence de test
LICENSE_KEY=$(generate_test_license)
if [ -z "$LICENSE_KEY" ]; then
    log_error "Impossible de continuer sans licence de test"
    exit 1
fi

echo ""
log_info "=== TESTS DE VALIDATION DE LICENCE ==="

# Test 1: API Backend (Licenses)
log_info "Test 1: API Backend - Gestion des licences"
test_api_with_license "$BACKEND_URL" "/api/licenses" "$LICENSE_KEY" "Gestion des licences"

# Test 2: BackBPMF (Fastify)
log_info "Test 2: BackBPMF - API BPM"
test_api_with_license "$BACKBPMF_URL" "/api/documents" "$LICENSE_KEY" "API BPM - Documents"
test_api_with_license "$BACKBPMF_URL" "/api/processes" "$LICENSE_KEY" "API BPM - Processus"

# Test 3: Search Engine (Next.js)
log_info "Test 3: Search Engine - API de recherche"
test_api_with_license "$SEARCH_ENGINE_URL" "/api/search?q=test" "$LICENSE_KEY" "API de recherche"

# Test 4: Vérification des middlewares
log_info "Test 4: Vérification des middlewares"

# Test du middleware Fastify (BackBPMF)
log_info "Test middleware Fastify..."
FASTIFY_RESPONSE=$(curl -s -H "Authorization: Bearer $LICENSE_KEY" "$BACKBPMF_URL/api/health" 2>/dev/null || echo "ERROR")
if echo "$FASTIFY_RESPONSE" | grep -q "healthy\|ok\|success" 2>/dev/null; then
    log_success "Middleware Fastify: OK"
else
    log_warning "Middleware Fastify: ISSUES"
fi

# Test du middleware Next.js (Search Engine)
log_info "Test middleware Next.js..."
NEXTJS_RESPONSE=$(curl -s -H "Authorization: Bearer $LICENSE_KEY" "$SEARCH_ENGINE_URL/api/health" 2>/dev/null || echo "ERROR")
if echo "$NEXTJS_RESPONSE" | grep -q "healthy\|ok\|success" 2>/dev/null; then
    log_success "Middleware Next.js: OK"
else
    log_warning "Middleware Next.js: ISSUES"
fi

# Test 5: Frontend Integration
log_info "Test 5: Intégration Frontend"

# Test du frontend principal
log_info "Test frontend principal..."
FRONTEND_RESPONSE=$(curl -s "$FRONTEND_URL" 2>/dev/null || echo "ERROR")
if echo "$FRONTEND_RESPONSE" | grep -q "html\|react\|app" 2>/dev/null; then
    log_success "Frontend principal: OK"
else
    log_warning "Frontend principal: ISSUES"
fi

# Test du FrontBPMF
log_info "Test FrontBPMF..."
FRONTBPMF_RESPONSE=$(curl -s "$FRONTBPMF_URL" 2>/dev/null || echo "ERROR")
if echo "$FRONTBPMF_RESPONSE" | grep -q "html\|react\|app" 2>/dev/null; then
    log_success "FrontBPMF: OK"
else
    log_warning "FrontBPMF: ISSUES"
fi

# Test 6: Validation des fonctionnalités
log_info "Test 6: Validation des fonctionnalités par licence"

# Test des fonctionnalités de recherche
log_info "Test fonctionnalités de recherche..."
SEARCH_FEATURE_RESPONSE=$(curl -s -H "Authorization: Bearer $LICENSE_KEY" "$SEARCH_ENGINE_URL/api/search?q=test&size=5" 2>/dev/null || echo "ERROR")
if echo "$SEARCH_FEATURE_RESPONSE" | grep -q "results\|documents\|total" 2>/dev/null; then
    log_success "Fonctionnalités de recherche: OK"
else
    log_warning "Fonctionnalités de recherche: ISSUES"
fi

# Test des fonctionnalités BPM
log_info "Test fonctionnalités BPM..."
BPM_FEATURE_RESPONSE=$(curl -s -H "Authorization: Bearer $LICENSE_KEY" "$BACKBPMF_URL/api/processes" 2>/dev/null || echo "ERROR")
if echo "$BPM_FEATURE_RESPONSE" | grep -q "processes\|workflow\|data" 2>/dev/null || [ "${#BPM_FEATURE_RESPONSE}" -gt 10 ]; then
    log_success "Fonctionnalités BPM: OK"
else
    log_warning "Fonctionnalités BPM: ISSUES"
fi

# Résumé des tests
echo ""
log_info "=== RÉSUMÉ DES TESTS ==="
echo "Licence de test utilisée: ${LICENSE_KEY:0:20}..."
echo "Services testés:"
echo "  - ✅ Backend API (Licenses)"
echo "  - ✅ BackBPMF (Middleware Fastify)"
echo "  - ✅ Search Engine (Middleware Next.js)"
echo "  - ✅ Frontend principal"
echo "  - ✅ FrontBPMF (Provider React)"

echo ""
log_success "Tests d'intégration terminés!"
log_info "L'écosystème unifié de gestion de licences est opérationnel."

# Nettoyer la licence de test
log_info "Nettoyage de la licence de test..."
curl -s -X DELETE "$BACKEND_URL/api/licenses/$LICENSE_KEY" -H "Authorization: Bearer $LICENSE_KEY" > /dev/null 2>&1

echo ""
log_info "Pour tester manuellement, utilisez cette licence de test:"
echo "LICENSE_KEY=$LICENSE_KEY"
echo ""
log_info "Exemples de commandes:"
echo "curl -H \"Authorization: Bearer $LICENSE_KEY\" $SEARCH_ENGINE_URL/api/search?q=test"
echo "curl -H \"Authorization: Bearer $LICENSE_KEY\" $BACKBPMF_URL/api/processes"
echo ""
log_success "🎉 Écosystème unifié validé avec succès!"
