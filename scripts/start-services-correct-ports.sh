#!/bin/bash

# Script de démarrage avec ports corrects
echo "🚀 Démarrage de tous les services avec les ports corrects"

# Créer le dossier logs
mkdir -p logs

# Fonction pour démarrer un service
start_service() {
    local name=$1
    local dir=$2
    local port=$3
    local command=$4
    
    echo "Starting $name on port $port..."
    cd "$dir"
    
    # Démarrer en arrière-plan avec la variable PORT
    PORT=$port nohup $command > "../logs/${name}.log" 2>&1 & 
    echo $! > "../logs/${name}.pid"
    
    echo "✅ $name started (PID: $(cat ../logs/${name}.pid), Port: $port)"
    cd ..
}

echo "1. Backend API (port 3001)..."
start_service "backend" "backend" "3001" "npm run dev"

echo "2. BackBPMF (port 3003)..."
start_service "backbpmf" "BackBPMF" "3003" "npm run dev"

echo "3. Search Engine (port 3002)..."
start_service "search-engine" "search-engine" "3002" "npm run dev"

echo "4. FrontBPMF (port 5174)..."
start_service "frontbpmf" "FrontBPMF" "5174" "npm run dev"

echo "5. Frontend Principal (port 5173)..."
start_service "frontend" "frontend" "5173" "npm run dev"

echo "6. Admin Dashboard (port 8080)..."
start_service "admin-dashboard" "admin-dashboard" "8080" "npm run dev"

echo ""
echo "⏳ Attente du démarrage complet..."
sleep 10

echo ""
echo "📊 VÉRIFICATION DES PORTS :"
echo "Backend API: http://localhost:3001"
echo "BackBPMF: http://localhost:3003"  
echo "Search Engine: http://localhost:3002"
echo "FrontBPMF: http://localhost:5174"
echo "Frontend: http://localhost:5173"
echo "Admin Dashboard: http://localhost:8080"

echo ""
echo "🎉 Tous les services démarrés !"
