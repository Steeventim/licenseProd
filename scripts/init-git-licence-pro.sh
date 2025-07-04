#!/bin/bash

# Script d'initialisation Git pour licence pro

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${WHITE}              🎓 INITIALISATION GIT LICENCE PRO               ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

cd "$PROJECT_ROOT"

# 1. Vérification/Initialisation Git
echo -e "${BLUE}🔧 Étape 1: Initialisation du repository Git${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Repository Git initialisé${NC}"
else
    echo -e "${YELLOW}⚠️  Repository Git déjà initialisé${NC}"
fi
echo ""

# 2. Configuration du README
echo -e "${BLUE}📝 Étape 2: Configuration du README pour licence pro${NC}"
if [ -f "README.md" ] && [ ! -f "README_ORIGINAL.md" ]; then
    cp "README.md" "README_ORIGINAL.md"
    echo -e "${GREEN}✅ README original sauvegardé${NC}"
fi

if [ -f "README_LICENCE_PRO.md" ]; then
    cp "README_LICENCE_PRO.md" "README.md"
    echo -e "${GREEN}✅ README licence pro activé${NC}"
fi
echo ""

# 3. Vérification du .gitignore
echo -e "${BLUE}🚫 Étape 3: Vérification des exclusions${NC}"
if grep -q "FrontBPMF/" .gitignore && grep -q "BackBPMF/" .gitignore && grep -q "search-engine/" .gitignore; then
    echo -e "${GREEN}✅ Modules BPM et search-engine exclus du versioning${NC}"
else
    echo -e "${RED}❌ Erreur: .gitignore non configuré correctement${NC}"
    exit 1
fi
echo ""

# 4. Ajout des fichiers
echo -e "${BLUE}📦 Étape 4: Ajout des fichiers au repository${NC}"
git add .
echo -e "${GREEN}✅ Fichiers ajoutés (selon .gitignore)${NC}"

# Affichage des statistiques
total_files=$(git diff --cached --name-only | wc -l)
echo -e "${BLUE}📊 $total_files fichiers prêts pour le commit${NC}"
echo ""

# 5. Premier commit
echo -e "${BLUE}💾 Étape 5: Premier commit${NC}"
read -p "Voulez-vous faire le premier commit maintenant ? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "🎓 Initial commit - Système de gestion de licences (Licence Pro)

- Frontend client React avec validation dynamique
- Dashboard administrateur avec auth JWT
- Backend API Node.js + Prisma + PostgreSQL  
- Interface de test complète
- Scripts d'automatisation
- Documentation complète

Modules BPM exclus pour version licence pro."

    echo -e "${GREEN}✅ Premier commit effectué${NC}"
else
    echo -e "${YELLOW}⏭️  Commit annulé - utilisez 'git commit' plus tard${NC}"
fi
echo ""

# 6. Instructions finales
echo -e "${PURPLE}🚀 ÉTAPES SUIVANTES :${NC}"
echo ""
echo -e "${WHITE}1. Créer le repository sur GitHub/GitLab${NC}"
echo ""
echo -e "${WHITE}2. Ajouter le remote :${NC}"
echo -e "   ${BLUE}git remote add origin https://github.com/votre-utilisateur/votre-repo.git${NC}"
echo ""
echo -e "${WHITE}3. Pousser vers le repository :${NC}"
echo -e "   ${BLUE}git branch -M main${NC}"
echo -e "   ${BLUE}git push -u origin main${NC}"
echo ""

echo -e "${WHITE}📋 Contenu inclus dans le repository :${NC}"
echo -e "  ✅ Frontend client (React + Tailwind)"
echo -e "  ✅ Dashboard admin (React + JWT auth)"
echo -e "  ✅ Backend API (Node.js + Prisma)"
echo -e "  ✅ Documentation complète"
echo -e "  ✅ Scripts d'automatisation"
echo -e "  ✅ Interface de test"
echo ""

echo -e "${RED}🚫 Contenu EXCLU du repository :${NC}"
echo -e "  🔴 FrontBPMF/ (Interface BPM)"
echo -e "  🔴 BackBPMF/ (Backend BPM)" 
echo -e "  🔴 search-engine/ (Moteur de recherche)"
echo ""

echo -e "${GREEN}🎉 Votre projet licence pro est prêt pour Git !${NC}"
