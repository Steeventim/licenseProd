#!/bin/bash

# Script de navigation dans la documentation et les scripts
# Usage: ./navigate.sh [docs|scripts|all]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Fonction d'affichage des couleurs
show_header() {
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${WHITE}                     🗂️  NAVIGATION PROJET                      ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Fonction pour lister la documentation
show_docs() {
    echo -e "${YELLOW}📖 DOCUMENTATION DISPONIBLE:${NC}"
    echo ""
    
    echo -e "${GREEN}📁 Documentation principale (docs/):${NC}"
    ls -la "$PROJECT_ROOT/docs/" | grep "\.md$" | awk '{print "  📄 " $9}'
    
    echo ""
    echo -e "${GREEN}📁 FrontBPMF (docs/frontbpmf/):${NC}"
    if [ -d "$PROJECT_ROOT/docs/frontbpmf" ]; then
        ls -la "$PROJECT_ROOT/docs/frontbpmf/" | grep "\.md$" | awk '{print "  📄 " $9}'
    fi
    
    echo ""
    echo -e "${GREEN}📁 BackBPMF (docs/backbpmf/):${NC}"
    if [ -d "$PROJECT_ROOT/docs/backbpmf" ]; then
        ls -la "$PROJECT_ROOT/docs/backbpmf/" | grep "\.md$" | awk '{print "  📄 " $9}'
    fi
    
    echo ""
    echo -e "${GREEN}📁 Search Engine (docs/search-engine/):${NC}"
    if [ -d "$PROJECT_ROOT/docs/search-engine" ]; then
        ls -la "$PROJECT_ROOT/docs/search-engine/" | grep "\.md$" | awk '{print "  📄 " $9}'
    fi
}

# Fonction pour lister les scripts
show_scripts() {
    echo -e "${YELLOW}🔧 SCRIPTS DISPONIBLES:${NC}"
    echo ""
    
    echo -e "${GREEN}📁 Scripts principaux (scripts/):${NC}"
    ls -la "$PROJECT_ROOT/scripts/" | grep "\.sh$" | awk '{print "  🔧 " $9}'
    
    echo ""
    echo -e "${BLUE}🔗 Liens symboliques à la racine:${NC}"
    ls -la "$PROJECT_ROOT/" | grep "^l" | grep "\.sh$" | awk '{print "  🔗 " $9 " -> " $11}'
}

# Fonction pour ouvrir la documentation dans un éditeur
open_docs() {
    echo -e "${PURPLE}📖 Ouverture de la documentation...${NC}"
    
    # Tenter d'ouvrir avec VS Code si disponible
    if command -v code &> /dev/null; then
        code "$PROJECT_ROOT/docs/"
        echo -e "${GREEN}✅ Documentation ouverte dans VS Code${NC}"
    # Sinon avec l'éditeur par défaut
    elif command -v $EDITOR &> /dev/null; then
        $EDITOR "$PROJECT_ROOT/docs/README.md"
        echo -e "${GREEN}✅ Documentation ouverte dans $EDITOR${NC}"
    else
        echo -e "${YELLOW}⚠️  Aucun éditeur détecté. Utilisez votre éditeur préféré pour ouvrir:${NC}"
        echo -e "   📁 $PROJECT_ROOT/docs/"
    fi
}

# Fonction pour ouvrir les scripts dans un éditeur
open_scripts() {
    echo -e "${PURPLE}🔧 Ouverture des scripts...${NC}"
    
    # Tenter d'ouvrir avec VS Code si disponible
    if command -v code &> /dev/null; then
        code "$PROJECT_ROOT/scripts/"
        echo -e "${GREEN}✅ Scripts ouverts dans VS Code${NC}"
    # Sinon avec l'éditeur par défaut
    elif command -v $EDITOR &> /dev/null; then
        $EDITOR "$PROJECT_ROOT/scripts/README.md"
        echo -e "${GREEN}✅ Scripts ouverts dans $EDITOR${NC}"
    else
        echo -e "${YELLOW}⚠️  Aucun éditeur détecté. Utilisez votre éditeur préféré pour ouvrir:${NC}"
        echo -e "   📁 $PROJECT_ROOT/scripts/"
    fi
}

# Fonction d'aide
show_help() {
    echo -e "${WHITE}Usage: $0 [OPTION]${NC}"
    echo ""
    echo -e "${GREEN}Options:${NC}"
    echo -e "  ${BLUE}docs${NC}     Afficher et ouvrir la documentation"
    echo -e "  ${BLUE}scripts${NC}  Afficher et ouvrir les scripts"
    echo -e "  ${BLUE}all${NC}      Afficher tout le contenu"
    echo -e "  ${BLUE}help${NC}     Afficher cette aide"
    echo ""
    echo -e "${GREEN}Exemples:${NC}"
    echo -e "  $0 docs     # Voir la documentation"
    echo -e "  $0 scripts  # Voir les scripts"
    echo -e "  $0 all      # Voir tout"
    echo ""
}

# Traitement des arguments
case "${1:-all}" in
    "docs")
        show_header
        show_docs
        echo ""
        read -p "Voulez-vous ouvrir la documentation ? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open_docs
        fi
        ;;
    "scripts")
        show_header
        show_scripts
        echo ""
        read -p "Voulez-vous ouvrir les scripts ? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open_scripts
        fi
        ;;
    "all")
        show_header
        show_docs
        echo ""
        show_scripts
        echo ""
        echo -e "${WHITE}💡 Utilisez './navigate.sh docs' ou './navigate.sh scripts' pour plus d'options${NC}"
        ;;
    "help"|"-h"|"--help")
        show_header
        show_help
        ;;
    *)
        echo -e "${RED}❌ Option non reconnue: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}📁 Structure du projet organisée:${NC}"
echo -e "  📖 ${GREEN}docs/${NC}    - Toute la documentation (.md)"
echo -e "  🔧 ${GREEN}scripts/${NC} - Tous les scripts (.sh)"
echo -e "  🔗 Liens symboliques à la racine pour les scripts principaux"
