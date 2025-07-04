#!/bin/bash

# Script de test complet de l'intégration des services
# Teste tous les endpoints et services intégrés

echo "🧪 Test complet d'intégration des services..."
echo "============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour tester un endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=$3
    local expected_status=$4
    local data=$5
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json "$url")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json -X POST -H "Content-Type: application/json" -d "$data" "$url")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (got $response, expected $expected_status)${NC}"
        if [ -f /tmp/test_response.json ]; then
            echo "Response: $(cat /tmp/test_response.json)"
        fi
        return 1
    fi
}

# Fonction pour vérifier qu'un service est accessible
check_service() {
    local name=$1
    local url=$2
    local port=$3
    
    echo -n "Checking $name on port $port... "
    
    if curl -s --connect-timeout 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ACTIVE${NC}"
        return 0
    else
        echo -e "${RED}❌ INACTIVE${NC}"
        return 1
    fi
}

# Variables pour les compteurs
passed=0
failed=0

echo ""
echo "📊 VÉRIFICATION DE L'ÉTAT DES SERVICES"
echo "--------------------------------------"

# Vérification des services principaux
check_service "Backend API (Licences)" "http://localhost:3001/health" "3001" && ((passed++)) || ((failed++))
check_service "Admin Dashboard" "http://localhost:3002/" "3002" && ((passed++)) || ((failed++))
check_service "Frontend Client" "http://localhost:3003/" "3003" && ((passed++)) || ((failed++))

# Vérification des nouveaux services (si disponibles)
check_service "BackBPMF (Documents)" "http://localhost:3004/" "3004" && ((passed++)) || ((failed++))
check_service "Search Engine" "http://localhost:3005/" "3005" && ((passed++)) || ((failed++))
check_service "FrontBPMF (BPM)" "http://localhost:5173/" "5173" && ((passed++)) || ((failed++))

echo ""
echo "🔍 TESTS D'API - SYSTÈME PRINCIPAL"
echo "-----------------------------------"

# Tests API principale
test_endpoint "Health Check" "http://localhost:3001/health" "GET" "200" && ((passed++)) || ((failed++))
test_endpoint "Liste des licences" "http://localhost:3001/api/licenses" "GET" "200" && ((passed++)) || ((failed++))
test_endpoint "Liste des clients" "http://localhost:3001/api/clients" "GET" "200" && ((passed++)) || ((failed++))

# Test de création de client
client_data='{"name":"Test Integration","email":"integration@test.com","domain":"integration.test.com"}'
test_endpoint "Création client" "http://localhost:3001/api/clients" "POST" "201" "$client_data" && ((passed++)) || ((failed++))

echo ""
echo "🔗 TESTS D'INTÉGRATION"
echo "----------------------"

# Tester la validation d'une licence existante
if curl -s "http://localhost:3001/api/licenses" | grep -q "LIC-"; then
    # Extraire une clé de licence active
    license_key=$(curl -s "http://localhost:3001/api/licenses" | grep -o '"key":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ ! -z "$license_key" ]; then
        echo -n "Testing license validation with key $license_key... "
        response=$(curl -s -w "%{http_code}" -o /tmp/test_response.json -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $license_key" \
            -d '{"domain":"localhost"}' \
            "http://localhost:3001/api/licenses/validate")
        
        if [ "$response" = "200" ] || [ "$response" = "403" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            ((passed++))
        else
            echo -e "${RED}❌ FAIL (got $response)${NC}"
            ((failed++))
        fi
    else
        echo -e "${YELLOW}⚠️  No license key found for validation test${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No licenses found for validation test${NC}"
fi

echo ""
echo "📋 RÉSUMÉ DES TESTS"
echo "==================="

total=$((passed + failed))
percentage=$((passed * 100 / total))

echo -e "Total des tests    : $total"
echo -e "Tests réussis      : ${GREEN}$passed${NC}"
echo -e "Tests échoués      : ${RED}$failed${NC}"
echo -e "Taux de réussite   : ${BLUE}$percentage%${NC}"

echo ""
if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS ONT RÉUSSI !${NC}"
    echo -e "${GREEN}✅ L'intégration est fonctionnelle${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  CERTAINS TESTS ONT ÉCHOUÉ${NC}"
    echo -e "${YELLOW}🔧 Vérifiez les services marqués comme inactifs${NC}"
    exit 1
fi
