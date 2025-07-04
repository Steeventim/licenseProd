#!/bin/bash

echo "🧪 Test de l'authentification admin..."

# Variables de test
API_URL="http://localhost:3001/api/auth"
USERNAME="Faubell7"
PASSWORD="Z04y627\$"

echo "📍 API URL: $API_URL"
echo "👤 Nom d'utilisateur: $USERNAME"
echo ""

# Test de connexion
echo "1️⃣  Test de connexion..."
response=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "Response: $response"

# Extraire le token (si disponible)
token=$(echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$token" ]; then
    echo "✅ Connexion réussie!"
    echo "🔑 Token obtenu: ${token:0:20}..."
    
    echo ""
    echo "2️⃣  Test de vérification du token..."
    
    # Test de vérification du token
    verify_response=$(curl -s -X GET "$API_URL/verify" \
      -H "Authorization: Bearer $token")
    
    echo "Response: $verify_response"
    
    if echo $verify_response | grep -q '"success":true'; then
        echo "✅ Vérification du token réussie!"
    else
        echo "❌ Échec de la vérification du token"
    fi
else
    echo "❌ Échec de la connexion"
    echo "Response: $response"
fi

echo ""
echo "🏁 Test terminé."
