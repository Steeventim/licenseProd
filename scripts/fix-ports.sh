#!/bin/bash

# Script de résolution des conflits de ports
# Ce script modifie les configurations pour éviter les conflits

echo "🔧 Résolution des conflits de ports..."

# Vérifier si BackBPMF utilise le port 3003 (conflit avec notre frontend client)
echo "Vérification du conflit de port BackBPMF..."

if grep -q "3003" /home/tims/Dev/Licenses_prod/BackBPMF/server.js; then
    echo "⚠️  CONFLIT DÉTECTÉ : BackBPMF utilise le port 3003"
    echo "🔄 Reconfiguration de BackBPMF vers le port 3004..."
    
    # Modifier le port dans server.js
    sed -i 's/3003/3004/g' /home/tims/Dev/Licenses_prod/BackBPMF/server.js
    
    # Créer un fichier .env local pour BackBPMF
    if [ ! -f /home/tims/Dev/Licenses_prod/BackBPMF/.env ]; then
        cp /home/tims/Dev/Licenses_prod/BackBPMF/.env.example /home/tims/Dev/Licenses_prod/BackBPMF/.env
    fi
    
    # Modifier le port dans .env
    sed -i 's/PORT=3003/PORT=3004/g' /home/tims/Dev/Licenses_prod/BackBPMF/.env
    
    echo "✅ BackBPMF reconfiguré sur le port 3004"
else
    echo "✅ Aucun conflit détecté pour BackBPMF"
fi

# Configurer le Search Engine sur le port 3005
echo "Configuration du Search Engine..."

cd /home/tims/Dev/Licenses_prod/search-engine

# Créer un fichier .env.local pour le Search Engine
if [ ! -f .env.local ]; then
    echo "PORT=3005" > .env.local
    echo "NEXT_PUBLIC_API_URL=http://localhost:3005" >> .env.local
    echo "✅ Search Engine configuré sur le port 3005"
else
    # Vérifier si le port est déjà configuré
    if ! grep -q "PORT=3005" .env.local; then
        echo "PORT=3005" >> .env.local
        echo "✅ Port 3005 ajouté à la configuration Search Engine"
    else
        echo "✅ Search Engine déjà configuré sur le port 3005"
    fi
fi

cd /home/tims/Dev/Licenses_prod

echo ""
echo "📋 RÉSUMÉ DE LA CONFIGURATION DES PORTS :"
echo "   - Backend API (Licences)     : 3001 ✅"
echo "   - Admin Dashboard (Licences) : 3002 ✅" 
echo "   - Frontend Client (Licences) : 3003 ✅"
echo "   - BackBPMF (Documents)       : 3004 ✅"
echo "   - Search Engine (Recherche)  : 3005 ✅"
echo "   - FrontBPMF (BPM Interface)  : 5173 ✅"
echo ""
echo "🎉 Configuration des ports terminée avec succès !"
