#!/bin/bash

# ========================================
# SCRIPT DE COMPATIBILITÉ - REDIRECTION
# ========================================

echo "🔄 Redirection vers le script unifié..."
echo ""
echo "ℹ️  Ce script est maintenant intégré dans start-all-services.sh"
echo "   Utilisation recommandée : ./start-all-services.sh"
echo ""

# Proposer les options
echo "Que souhaitez-vous faire ?"
echo ""
echo "1) Démarrer TOUS les services (recommandé)"
echo "2) Démarrer seulement Backend + Admin Dashboard"
echo "3) Voir la documentation"
echo "4) Annuler"
echo ""

read -p "Votre choix [1-4] : " choice

case $choice in
    1)
        echo "🚀 Démarrage de tous les services..."
        exec ./start-all-services.sh
        ;;
    2)
        echo "🔐 Démarrage du système d'authentification..."
        # Mode allégé - seulement Backend + Admin
        cd /home/tims/Dev/Licenses_prod
        mkdir -p logs
        
        echo "🔄 Démarrage Backend API..."
        cd backend
        nohup npm run dev > ../logs/Backend-API.log 2>&1 &
        echo $! > ../logs/Backend-API.pid
        cd ..
        
        echo "🔄 Démarrage Admin Dashboard..."
        cd admin-dashboard  
        nohup npm run dev > ../logs/Admin-Dashboard.log 2>&1 &
        echo $! > ../logs/Admin-Dashboard.pid
        cd ..
        
        echo ""
        echo "⏳ Attente du démarrage..."
        sleep 8
        
        echo ""
        echo "🎉 Services d'authentification démarrés !"
        echo "🔧 Admin Dashboard : http://localhost:8080"
        echo "🔑 Login : Faubell7 / Z04y627$"
        ;;
    3)
        echo "📖 Ouverture de la documentation..."
        if command -v less &> /dev/null; then
            less START_SERVICES_DOCUMENTATION.md
        else
            cat START_SERVICES_DOCUMENTATION.md
        fi
        ;;
    4)
        echo "❌ Annulé"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
