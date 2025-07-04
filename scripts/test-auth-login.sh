#!/bin/bash

echo "🔐 Test de l'authentification admin..."

# Test 1: Tentative de connexion avec des identifiants corrects
echo ""
echo "Test 1: Connexion avec les bons identifiants (Faubell7 / Z04y627$)"
response=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Faubell7","password":"Z04y627$"}')

echo "Réponse: $response"

# Extraire le token si la connexion a réussi
token=$(echo $response | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$token" ]; then
    echo "✅ Connexion réussie ! Token reçu."
    
    # Test 2: Vérification du token
    echo ""
    echo "Test 2: Vérification du token"
    verify_response=$(curl -s -X GET http://localhost:3001/api/auth/verify \
      -H "Authorization: Bearer $token")
    
    echo "Réponse de vérification: $verify_response"
    
    if echo $verify_response | grep -q '"success":true'; then
        echo "✅ Token valide !"
    else
        echo "❌ Token invalide"
    fi
else
    echo "❌ Connexion échouée"
fi

# Test 3: Tentative avec de mauvais identifiants
echo ""
echo "Test 3: Connexion avec de mauvais identifiants"
bad_response=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}')

echo "Réponse: $bad_response"

if echo $bad_response | grep -q 'Identifiants invalides'; then
    echo "✅ Rejet correct des mauvais identifiants"
else
    echo "❌ Problème avec la validation des identifiants"
fi

echo ""
echo "🎯 Tests d'authentification terminés !"
