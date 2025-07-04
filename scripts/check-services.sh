#!/bin/bash

# Script de vérification rapide de l'état des services
echo "🔍 VÉRIFICATION RAPIDE DE L'ÉCOSYSTÈME"
echo "======================================="
echo ""

# Services et leurs ports
services=(
    "Backend API:3001:/health"
    "Search Engine:3000:/"
    "BackBPMF:3003:/"
    "Frontend Client:5173:/"
    "FrontBPMF:5174:/"
    "Admin Dashboard:8080:/"
)

echo "📊 État des services :"
echo "----------------------"

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    path=$(echo $service | cut -d: -f3)
    
    if netstat -tuln | grep -q ":$port "; then
        echo "✅ $name - http://localhost:$port$path"
    else
        echo "❌ $name - Service non disponible sur le port $port"
    fi
done

echo ""
echo "📋 Logs disponibles :"
echo "--------------------"
if [ -d "logs" ]; then
    echo "📁 Dossier logs : $(ls logs/*.log 2>/dev/null | wc -l) fichiers de logs"
    echo "📄 Derniers logs modifiés :"
    ls -lt logs/*.log 2>/dev/null | head -3 | while read line; do
        file=$(echo $line | awk '{print $9}')
        echo "   • $(basename $file)"
    done
else
    echo "⚠️  Dossier logs introuvable"
fi

echo ""
echo "💾 Processus actifs :"
echo "-------------------"
ps aux | grep -E "(node|npm)" | grep -v grep | grep -v vscode | wc -l | xargs echo "🔢 Processus Node.js actifs :"

echo ""
echo "🌐 URLs de test rapide :"
echo "------------------------"
echo "   📱 Interface Client:     http://localhost:5173"
echo "   🔧 Admin Dashboard:      http://localhost:8080"
echo "   📄 Documents DGI:        http://localhost:3003"
echo "   🔍 Recherche IA:         http://localhost:3000"
echo "   📊 Interface BPM:        http://localhost:5174"
echo "   🔑 Test de licence:      http://localhost:5173/test-license-interface.html"

echo ""
echo "🛠️  Commandes utiles :"
echo "----------------------"
echo "   • Arrêter tout:          ./stop-all-services.sh"
echo "   • Redémarrer:            ./start-all-services.sh"
echo "   • Voir logs en temps réel: tail -f logs/[service].log"
echo "   • Tuer un processus:     kill \$(cat logs/[service].pid)"
