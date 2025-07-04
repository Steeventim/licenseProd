#!/bin/bash

# Script de préparation pour Git - Version Licence Pro
# Exclut les modules BPM et search engine

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

show_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${WHITE}            🎓 PRÉPARATION LICENCE PRO POUR GIT              ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

check_git_status() {
    echo -e "${YELLOW}🔍 Vérification de l'état Git...${NC}"
    
    cd "$PROJECT_ROOT"
    
    if [ ! -d ".git" ]; then
        echo -e "${BLUE}📁 Initialisation du repository Git...${NC}"
        git init
        echo -e "${GREEN}✅ Repository Git initialisé${NC}"
    else
        echo -e "${GREEN}✅ Repository Git détecté${NC}"
    fi
    
    echo ""
}

show_excluded_content() {
    echo -e "${YELLOW}🚫 Contenu EXCLU du repository (selon .gitignore) :${NC}"
    echo ""
    
    echo -e "${RED}📁 Modules exclus :${NC}"
    echo -e "  🔴 FrontBPMF/ (Interface BPM Frontend)"
    echo -e "  🔴 BackBPMF/ (Interface BPM Backend)" 
    echo -e "  🔴 search-engine/ (Moteur de recherche)"
    
    echo ""
    echo -e "${RED}📖 Documentation exclue :${NC}"
    echo -e "  🔴 docs/frontbpmf/"
    echo -e "  🔴 docs/backbpmf/"
    echo -e "  🔴 docs/search-engine/"
    
    echo ""
    echo -e "${RED}🔧 Scripts exclus :${NC}"
    echo -e "  🔴 scripts/frontbpmf/"
    
    echo ""
}

show_included_content() {
    echo -e "${YELLOW}✅ Contenu INCLUS dans le repository :${NC}"
    echo ""
    
    echo -e "${GREEN}🎨 Frontend & Interface :${NC}"
    echo -e "  ✅ frontend/ (Interface client React)"
    echo -e "  ✅ admin-dashboard/ (Dashboard administrateur)"
    echo -e "  ✅ test-all-features.html (Interface de test)"
    
    echo ""
    echo -e "${GREEN}⚙️ Backend & API :${NC}"
    echo -e "  ✅ backend/ (API Node.js + Prisma)"
    echo -e "  ✅ shared/ (Composants partagés)"
    
    echo ""
    echo -e "${GREEN}📖 Documentation :${NC}"
    echo -e "  ✅ docs/ (Documentation principale)"
    echo -e "  ✅ README.md & README_LICENCE_PRO.md"
    
    echo ""
    echo -e "${GREEN}🔧 Scripts & Configuration :${NC}"
    echo -e "  ✅ scripts/ (Scripts principaux)"
    echo -e "  ✅ docker-compose.yml"
    echo -e "  ✅ .gitignore (configuré pour licence pro)"
    
    echo ""
}

prepare_readme() {
    echo -e "${BLUE}📝 Préparation du README pour licence pro...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Sauvegarder le README original s'il n'existe pas déjà
    if [ ! -f "README_ORIGINAL.md" ] && [ -f "README.md" ]; then
        cp "README.md" "README_ORIGINAL.md"
        echo -e "${GREEN}✅ README original sauvegardé${NC}"
    fi
    
    # Remplacer par la version licence pro
    if [ -f "README_LICENCE_PRO.md" ]; then
        cp "README_LICENCE_PRO.md" "README.md"
        echo -e "${GREEN}✅ README licence pro activé${NC}"
    fi
    
    echo ""
}

check_gitignore() {
    echo -e "${BLUE}🔍 Vérification du .gitignore...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # Vérifier que les exclusions sont bien présentes
    if grep -q "FrontBPMF/" .gitignore && grep -q "BackBPMF/" .gitignore && grep -q "search-engine/" .gitignore; then
        echo -e "${GREEN}✅ .gitignore correctement configuré pour licence pro${NC}"
    else
        echo -e "${RED}❌ .gitignore non configuré - relancez la configuration${NC}"
        exit 1
    fi
    
    echo ""
}

preview_git_status() {
    echo -e "${BLUE}👀 Aperçu des fichiers qui seront versionnés :${NC}"
    echo ""
    
    cd "$PROJECT_ROOT"
    
    # Simulation de git add pour voir ce qui sera inclus
    git add -n . 2>/dev/null | head -20
    
    if [ $(git add -n . 2>/dev/null | wc -l) -gt 20 ]; then
        echo "... et $(git add -n . 2>/dev/null | wc -l | awk '{print $1-20}') fichiers supplémentaires"
    fi
    
    echo ""
    echo -e "${YELLOW}📊 Statistiques :${NC}"
    local total_files=$(git add -n . 2>/dev/null | wc -l)
    echo -e "  📁 Fichiers total à versionner : ${GREEN}$total_files${NC}"
    echo ""
}

git_commands_help() {
    echo -e "${PURPLE}🚀 Commandes Git suivantes recommandées :${NC}"
    echo ""
    
    echo -e "${WHITE}1. Ajouter tous les fichiers :${NC}"
    echo -e "   ${BLUE}git add .${NC}"
    echo ""
    
    echo -e "${WHITE}2. Premier commit :${NC}"
    echo -e "   ${BLUE}git commit -m \"🎓 Initial commit - Système de licences (Licence Pro)\"${NC}"
    echo ""
    
    echo -e "${WHITE}3. Ajouter le remote (remplacez par votre URL) :${NC}"
    echo -e "   ${BLUE}git remote add origin https://github.com/votre-utilisateur/votre-repo.git${NC}"
    echo ""
    
    echo -e "${WHITE}4. Pousser vers GitHub :${NC}"
    echo -e "   ${BLUE}git branch -M main${NC}"
    echo -e "   ${BLUE}git push -u origin main${NC}"
    echo ""
}

restore_original() {
    echo -e "${YELLOW}🔄 Restoration du README original...${NC}"
    
    cd "$PROJECT_ROOT"
    
    if [ -f "README_ORIGINAL.md" ]; then
        cp "README_ORIGINAL.md" "README.md"
        echo -e "${GREEN}✅ README original restauré${NC}"
    else
        echo -e "${YELLOW}⚠️  Pas de README original trouvé${NC}"
    fi
}

# Menu principal
show_menu() {
    echo -e "${WHITE}Que souhaitez-vous faire ?${NC}"
    echo ""
    echo -e "${GREEN}1.${NC} Préparer pour Git (recommandé)"
    echo -e "${GREEN}2.${NC} Voir le contenu exclu"  
    echo -e "${GREEN}3.${NC} Voir le contenu inclus"
    echo -e "${GREEN}4.${NC} Aperçu Git status"
    echo -e "${GREEN}5.${NC} Voir les commandes Git"
    echo -e "${GREEN}6.${NC} Restaurer README original"
    echo -e "${RED}q.${NC} Quitter"
    echo ""
    
    read -p "Votre choix : " choice
    
    case $choice in
        1)
            echo ""
            check_git_status
            prepare_readme
            check_gitignore
            show_excluded_content
            show_included_content
            preview_git_status
            git_commands_help
            ;;
        2)
            echo ""
            show_excluded_content
            ;;
        3)
            echo ""
            show_included_content
            ;;
        4)
            echo ""
            preview_git_status
            ;;
        5)
            echo ""
            git_commands_help
            ;;
        6)
            echo ""
            restore_original
            ;;
        q|Q)
            echo -e "${GREEN}👋 Au revoir !${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Choix invalide${NC}"
            echo ""
            show_menu
            ;;
    esac
}

# Exécution principale
show_header
show_menu

echo ""
echo -e "${CYAN}📁 Votre projet licence pro est prêt pour Git !${NC}"
echo -e "${YELLOW}💡 N'oubliez pas de créer votre repository sur GitHub avant de pousser${NC}"
