#!/bin/bash

# Script de vérification rapide du contenu Git pour licence pro

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 VÉRIFICATION CONTENU GIT - LICENCE PRO${NC}"
echo "=================================================="
echo ""

cd "$PROJECT_ROOT"

echo -e "${GREEN}✅ DOSSIERS INCLUS :${NC}"
for dir in frontend admin-dashboard backend docs scripts shared; do
    if [ -d "$dir" ]; then
        echo "  📁 $dir/"
    fi
done
echo ""

echo -e "${RED}🚫 DOSSIERS EXCLUS (selon .gitignore) :${NC}"
for dir in FrontBPMF BackBPMF search-engine; do
    if [ -d "$dir" ]; then
        echo "  🔴 $dir/ (EXCLU)"
    fi
done
echo ""

echo -e "${YELLOW}📄 FICHIERS PRINCIPAUX :${NC}"
for file in README.md README_LICENCE_PRO.md docker-compose.yml test-all-features.html .gitignore; do
    if [ -f "$file" ]; then
        echo "  📄 $file"
    fi
done
echo ""

echo -e "${BLUE}📊 STATISTIQUES :${NC}"
total_dirs=$(find . -maxdepth 1 -type d ! -name "." ! -name ".git" | wc -l)
excluded_dirs=$(echo "FrontBPMF BackBPMF search-engine" | wc -w)
included_dirs=$((total_dirs - excluded_dirs))

echo "  📁 Dossiers total : $total_dirs"
echo "  ✅ Dossiers inclus : $included_dirs"
echo "  🚫 Dossiers exclus : $excluded_dirs"
echo ""

if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✅ .gitignore configuré pour licence pro${NC}"
else
    echo -e "${RED}❌ .gitignore manquant${NC}"
fi
