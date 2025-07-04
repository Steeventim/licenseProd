#!/bin/bash

# Test complet de l'écosystème unifié avec validation de licence
echo "🧪 TEST COMPLET DE L'ÉCOSYSTÈME UNIFIÉ"
echo "======================================="

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Compteurs
passed=0
failed=0
total=0

test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local license_key="$4"
    
    echo -n "Testing $name... "
    ((total++))
    
    if [ -n "$license_key" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json \
            -H "Authorization: Bearer $license_key" "$url" 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json "$url" 2>/dev/null)
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ FAIL (got $response, expected $expected_status)${NC}"
        ((failed++))
    fi
}

# 1. Vérifier que tous les services sont actifs
echo ""
echo "📊 1. VÉRIFICATION DES SERVICES"
echo "--------------------------------"

services=(
    "Backend API:3001:http://localhost:3001/health"
    "Admin Dashboard:3002:http://localhost:3002"
    "Frontend Client:3003:http://localhost:3003"
    "BackBPMF:3004:http://localhost:3004"
    "Search Engine:3005:http://localhost:3005"
    "FrontBPMF:5173:http://localhost:5173"
)

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    url=$(echo $service | cut -d: -f3)
    
    test_endpoint "$name (Port $port)" "$url" "200"
done

# 2. Obtenir une licence pour les tests
echo ""
echo "🔐 2. CONFIGURATION DE LA LICENCE DE TEST"
echo "------------------------------------------"

# Créer un client de test
echo "Création d'un client de test..."
client_response=$(curl -s -X POST http://localhost:3001/api/clients \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Ecosystème","email":"test-ecosystem@example.com","domain":"localhost"}')

if echo "$client_response" | grep -q '"id"'; then
    client_id=$(echo "$client_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ Client créé: $client_id${NC}"
    
    # Créer une licence avec toutes les fonctionnalités
    echo "Création d'une licence complète..."
    license_response=$(curl -s -X POST http://localhost:3001/api/licenses \
        -H "Content-Type: application/json" \
        -d "{\"clientId\":\"$client_id\",\"features\":[\"basic\",\"documents\",\"bpm\",\"search\",\"workflow\",\"advanced-search\",\"export\",\"analytics\"],\"expiresAt\":\"2025-12-31T23:59:59.000Z\"}")
    
    if echo "$license_response" | grep -q '"key"'; then
        license_key=$(echo "$license_response" | grep -o '"key":"[^"]*"' | cut -d'"' -f4)
        echo -e "${GREEN}✅ Licence créée: $license_key${NC}"
    else
        echo -e "${RED}❌ Erreur création licence${NC}"
        license_key=""
    fi
else
    echo -e "${RED}❌ Erreur création client${NC}"
    license_key=""
fi

# 3. Tests avec validation de licence
echo ""
echo "🔗 3. TESTS DE VALIDATION DE LICENCE"
echo "------------------------------------"

if [ -n "$license_key" ]; then
    # Test validation de licence
    test_endpoint "Validation de licence" "http://localhost:3001/api/licenses/validate" "200" "$license_key"
    
    # Test BackBPMF avec licence
    test_endpoint "BackBPMF avec licence" "http://localhost:3004/license-status" "200" "$license_key"
    
    # Test ping de licence
    test_endpoint "Ping de licence" "http://localhost:3001/api/licenses/ping" "200" "$license_key"
else
    echo -e "${YELLOW}⚠️ Pas de licence disponible pour les tests${NC}"
fi

# 4. Test des endpoints principaux
echo ""
echo "📡 4. TESTS DES ENDPOINTS PRINCIPAUX"
echo "-------------------------------------"

test_endpoint "Liste des clients" "http://localhost:3001/api/clients" "200"
test_endpoint "Liste des licences" "http://localhost:3001/api/licenses" "200"

# 5. Test des modules externes (si disponibles)
echo ""
echo "🌐 5. TESTS DES MODULES EXTERNES"
echo "--------------------------------"

# Test Search Engine
test_endpoint "Search Engine Health" "http://localhost:3005/api/health" "200"

# Test BackBPMF Health
test_endpoint "BackBPMF Health" "http://localhost:3004/health" "200"

# 6. Test d'intégration Frontend
echo ""
echo "🖥️ 6. TESTS D'INTÉGRATION FRONTEND"
echo "-----------------------------------"

if [ -n "$license_key" ]; then
    # Simuler une requête frontend avec licence
    frontend_test=$(curl -s -X POST http://localhost:3001/api/licenses/validate \
        -H "Authorization: Bearer $license_key" \
        -H "Content-Type: application/json" \
        -d '{"domain":"localhost"}')
    
    if echo "$frontend_test" | grep -q '"valid":true'; then
        echo -e "${GREEN}✅ Frontend integration test${NC}"
        ((passed++))
    else
        echo -e "${RED}❌ Frontend integration test${NC}"
        ((failed++))
    fi
    ((total++))
else
    echo -e "${YELLOW}⚠️ Pas de licence pour test frontend${NC}"
fi

# 7. Résumé et recommandations
echo ""
echo "📋 RÉSUMÉ DES TESTS"
echo "==================="

percentage=$((passed * 100 / total))

echo -e "Total des tests    : $total"
echo -e "Tests réussis      : ${GREEN}$passed${NC}"
echo -e "Tests échoués      : ${RED}$failed${NC}"
echo -e "Taux de réussite   : ${BLUE}$percentage%${NC}"

echo ""
if [ $percentage -ge 80 ]; then
    echo -e "${GREEN}🎉 ÉCOSYSTÈME OPÉRATIONNEL !${NC}"
    echo -e "${GREEN}✅ L'intégration des modules avec validation de licence fonctionne${NC}"
    
    if [ -n "$license_key" ]; then
        echo ""
        echo -e "${BLUE}🔑 LICENCE DE TEST CRÉÉE :${NC}"
        echo "   Clé: $license_key"
        echo "   Client: Test Ecosystème"
        echo "   Fonctionnalités: basic, documents, bpm, search, workflow, advanced-search, export, analytics"
        echo ""
        echo -e "${BLUE}📱 ACCÈS AUX INTERFACES :${NC}"
        echo "   Frontend Unifié: http://localhost:3003"
        echo "   Admin Dashboard: http://localhost:3002"
        echo "   BackBPMF: http://localhost:3004"
        echo "   Search Engine: http://localhost:3005"
        echo "   FrontBPMF: http://localhost:5173"
        echo ""
        echo -e "${BLUE}🚀 POUR TESTER L'INTERFACE UNIFIÉE :${NC}"
        echo "   1. Ouvrir http://localhost:3003"
        echo "   2. Utiliser la licence: $license_key"
        echo "   3. Explorer tous les modules intégrés"
    fi
else
    echo -e "${YELLOW}⚠️ INTÉGRATION PARTIELLE${NC}"
    echo -e "${YELLOW}🔧 Certains services ou fonctionnalités nécessitent une attention${NC}"
fi

# Nettoyage
rm -f /tmp/test_response.json

exit $((failed > 0 ? 1 : 0))
