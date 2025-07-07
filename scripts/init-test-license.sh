#!/bin/bash

# Script d'initialisation de licence de test pour le projet

echo "======================================"
echo "  INITIALISATION LICENCE DE TEST"
echo "======================================"

cd "$(dirname "$0")/../backend"

# Vérifier que Prisma est configuré
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ Schema Prisma non trouvé"
    exit 1
fi

# Vérifier que la base de données est accessible
echo "🔍 Vérification de la base de données..."
npm run prisma:status 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Base de données non accessible, tentative de migration..."
    npm run prisma:migrate
fi

# Exécuter le script d'initialisation de licence
echo "🚀 Génération de la licence de test..."
node scripts/init-test-license.js generate

echo ""
echo "✅ Initialisation terminée !"
echo ""
echo "💡 Pour utiliser la licence :"
echo "   1. Ouvrez http://localhost:5173/"
echo "   2. Cliquez sur 'Utiliser la licence de test'"
echo "   3. Ou copiez la clé affichée ci-dessus"
echo ""
