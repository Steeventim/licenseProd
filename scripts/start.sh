#!/bin/bash

# Script de démarrage complet du système de gestion de licences

echo "🚀 Démarrage du système de gestion de licences..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Fonction pour démarrer un service en arrière-plan
start_service() {
    local service_name=$1
    local directory=$2
    local port=$3
    local start_command=$4
    
    echo "🔄 Démarrage de $service_name sur le port $port..."
    
    cd "$directory"
    
    # Vérifier si package.json existe
    if [ ! -f "package.json" ]; then
        echo "❌ package.json non trouvé dans $directory"
        return 1
    fi
    
    # Installer les dépendances si node_modules n'existe pas
    if [ ! -d "node_modules" ]; then
        echo "📦 Installation des dépendances pour $service_name..."
        npm install
    fi
    
    # Démarrer le service
    nohup npm run $start_command > "../logs/${service_name}.log" 2>&1 &
    local pid=$!
    echo $pid > "../logs/${service_name}.pid"
    
    echo "✅ $service_name démarré (PID: $pid)"
    cd ..
}

# Créer le dossier des logs
mkdir -p logs

# Démarrer le backend
echo "🔧 Configuration du backend..."
cd backend

# Vérifier la configuration .env
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env depuis le template..."
    cp .env.example .env 2>/dev/null || echo "⚠️  Veuillez créer le fichier .env avec vos paramètres"
fi

# Générer Prisma si nécessaire
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.prisma/client/index.js" ]; then
    echo "🔄 Installation des dépendances et génération Prisma..."
    npm install
    npm run db:generate
fi

cd ..

# Démarrer les services
start_service "Backend API" "backend" "3001" "dev"
start_service "Frontend Client" "frontend" "5173" "dev"
start_service "Admin Dashboard" "admin-dashboard" "8080" "dev"

echo ""
echo "🎉 Tous les services sont démarrés !"
echo ""
echo "📋 URLs disponibles :"
echo "   🔗 API Backend:        http://localhost:3001"
echo "   🔗 Frontend Client:    http://localhost:5173"
echo "   🔗 Admin Dashboard:    http://localhost:8080"
echo ""
echo "📊 Logs disponibles dans le dossier 'logs/'"
echo ""
echo "🛑 Pour arrêter tous les services, utilisez : ./stop.sh"
echo ""

# Afficher les PIDs pour info
echo "📋 PIDs des processus :"
for pidfile in logs/*.pid; do
    if [ -f "$pidfile" ]; then
        service=$(basename "$pidfile" .pid)
        pid=$(cat "$pidfile")
        echo "   $service: $pid"
    fi
done

echo ""
echo "⏳ Les services peuvent prendre quelques secondes à démarrer complètement..."
