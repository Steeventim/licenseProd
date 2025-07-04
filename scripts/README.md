# 🔧 SCRIPTS - INDEX

Ce dossier contient tous les scripts d'automatisation et de gestion du projet.

## 📋 ORGANISATION

### 📁 Scripts par Module
| Dossier | Description |
|---------|-------------|
| [`frontbpmf/`](frontbpmf/README.md) | Scripts spécifiques au module FrontBPMF |

### 🚀 Scripts de Démarrage
| Script | Description | Usage |
|--------|-------------|-------|
| `start-all-services.sh` | **Script principal** - Démarre tout l'écosystème | `./start-all-services.sh` |
| `start-auth-system.sh` | Démarre seulement Backend + Admin Dashboard | `./start-auth-system.sh` |
| `start-legacy-compat.sh` | Menu de compatibilité avec anciens scripts | `./start-legacy-compat.sh` |
| `start-services-correct-ports.sh` | Démarre avec ports corrects (legacy) | `./start-services-correct-ports.sh` |
| `start.sh` | Script de base (legacy) | `./start.sh` |

### 🛑 Scripts d'Arrêt
| Script | Description | Usage |
|--------|-------------|-------|
| `stop-all-services.sh` | **Script principal** - Arrête tous les services | `./stop-all-services.sh` |
| `stop-all-services-new.sh` | Version alternative d'arrêt | `./stop-all-services-new.sh` |
| `stop.sh` | Script d'arrêt de base (legacy) | `./stop.sh` |

### 🧪 Scripts de Test
| Script | Description | Usage |
|--------|-------------|-------|
| `test-auth-admin.sh` | Test authentification admin | `./test-auth-admin.sh` |
| `test-auth-login.sh` | Test login utilisateur | `./test-auth-login.sh` |
| `test-integration.sh` | Tests d'intégration | `./test-integration.sh` |
| `test-unified-ecosystem.sh` | Test écosystème complet | `./test-unified-ecosystem.sh` |
| `test-unified-ecosystem-complete.sh` | Test complet avec validation | `./test-unified-ecosystem-complete.sh` |
| `test-visual-interactive.sh` | Tests visuels interactifs | `./test-visual-interactive.sh` |

### ⚙️ Scripts Utilitaires
| Script | Description | Usage |
|--------|-------------|-------|
| `check-services.sh` | Vérification état des services | `./check-services.sh` |
| `check-final-integration.sh` | Vérification intégration finale | `./check-final-integration.sh` |
| `fix-ports.sh` | Correction conflits de ports | `./fix-ports.sh` |
| `open-test-interfaces.sh` | Ouverture interfaces de test | `./open-test-interfaces.sh` |

## 🎯 SCRIPTS PRINCIPAUX

### ⭐ Script unifié (recommandé)
```bash
# Démarrer tout l'écosystème
./start-all-services.sh

# Arrêter tous les services
./stop-all-services.sh
```

### 🔗 Liens symboliques à la racine
Pour faciliter l'utilisation, des liens symboliques sont créés à la racine :
- `../start-all-services.sh` → `scripts/start-all-services.sh`
- `../stop-all-services.sh` → `scripts/stop-all-services.sh`

## 📊 WORKFLOW RECOMMANDÉ

### 1. Démarrage quotidien
```bash
# Démarrer tous les services
./start-all-services.sh

# Vérifier l'état
./check-services.sh
```

### 2. Tests et validation
```bash
# Test complet de l'écosystème
./test-unified-ecosystem-complete.sh

# Test authentification
./test-auth-admin.sh
./test-auth-login.sh
```

### 3. Dépannage
```bash
# Corriger les conflits de ports
./fix-ports.sh

# Ouvrir interfaces de test
./open-test-interfaces.sh
```

### 4. Arrêt propre
```bash
# Arrêter tous les services
./stop-all-services.sh
```

## ⚡ SCRIPTS PAR CATÉGORIE D'USAGE

### 🎯 Développeur Frontend
- `start-all-services.sh` - Démarrage complet
- `test-visual-interactive.sh` - Tests visuels
- `open-test-interfaces.sh` - Interfaces de test

### 🔧 Développeur Backend
- `start-auth-system.sh` - Backend + Admin seulement
- `test-integration.sh` - Tests d'intégration
- `check-services.sh` - Vérification services

### 👑 Administrateur Système
- `start-all-services.sh` - Démarrage production
- `stop-all-services.sh` - Arrêt propre
- `check-final-integration.sh` - Validation finale

### 🧪 Testeur/QA
- `test-unified-ecosystem-complete.sh` - Tests complets
- `test-auth-admin.sh` - Tests authentification
- `test-visual-interactive.sh` - Tests visuels

## 🔒 PERMISSIONS

Tous les scripts sont exécutables :
```bash
chmod +x scripts/*.sh
```

## 📝 LOGS

Les scripts génèrent des logs dans :
- `../logs/` - Logs des services
- Sortie console avec codes couleur

## ⚠️ NOTES IMPORTANTES

### Scripts legacy
Les anciens scripts sont conservés pour compatibilité mais l'usage du script unifié `start-all-services.sh` est recommandé.

### Variables d'environnement
Certains scripts utilisent des variables d'environnement définies dans les fichiers `.env` des services.

### Dépendances
- Node.js 18+
- npm 8+
- Ports 3000-3004, 5173-5174, 8080

## 🔄 ÉVOLUTION

### Version 3.0 (Actuelle)
- Script unifié `start-all-services.sh`
- Gestion d'erreurs robuste
- Interface colorée

### Version 2.0
- Scripts modulaires
- Tests automatisés
- Gestion des ports

### Version 1.0
- Scripts de base
- Fonctionnalités essentielles

---

📅 **Dernière mise à jour** : 4 juillet 2025  
🎯 **Statut** : Scripts organisés et optimisés  
🔗 **Documentation** : `../docs/START_SERVICES_DOCUMENTATION.md`
