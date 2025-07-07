# 🔐 Système de Gestion de Licences - Version Licence Pro

Un système complet de gestion et validation de licences pour applications web, développé dans le cadre d'une licence professionnelle.

## 📋 Description

Ce projet implémente un écosystème de gestion de licences comprenant :
- **Frontend client** moderne avec validation dynamique des fonctionnalités
- **Dashboard administrateur** pour la gestion des licences
- **API Backend** robuste avec authentification JWT
- **Système de validation** en temps réel
- **Interface de test** complète

## 🏗️ Architecture

```
📦 Système de Licences
├── 🎨 frontend/           # Interface client React + Tailwind
├── 🛠️ admin-dashboard/    # Dashboard admin React
├── ⚙️ backend/            # API Node.js + Prisma + PostgreSQL
├── 📖 docs/               # Documentation complète
├── 🔧 scripts/            # Scripts d'automatisation
└── 🧪 test-all-features.html # Interface de test
```

## ✨ Fonctionnalités

### 🎯 Frontend Client
- **Interface moderne** avec sidebar responsive
- **Validation dynamique** des modules selon la licence
- **Garde de fonctionnalités** (FeatureGuard, LicenseGuard)
- **Design Tailwind CSS** cohérent et accessible
- **Récupération automatique** de licence de test

### 🛡️ Dashboard Administrateur
- **Authentification sécurisée** (JWT + bcrypt)
- **Gestion complète des licences** (CRUD)
- **Interface d'édition avancée** avec validation
- **Feedback utilisateur** en temps réel

### 🔧 Backend API
- **Architecture RESTful** avec Fastify
- **Base de données PostgreSQL** avec Prisma ORM
- **Authentification JWT** sécurisée
- **Validation robuste** des licences
- **Gestion des erreurs** centralisée
- **Endpoint de test automatique** (/api/licenses/test-license)

### 📊 Système de Licences
- **Génération de clés** sécurisées
- **Validation en temps réel** 
- **Gestion des expirations**
- **Fonctionnalités modulaires** (search, export, analytics, api_access)
- **Licences de test automatiques** (24h)

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** 18+ 
- **PostgreSQL** 12+
- **npm** ou **yarn**

### Installation Rapide

1. **Cloner le projet** :
```bash
git clone <votre-repo>
cd licenseProd
```

2. **Démarrer tous les services** :
```bash
./start-all-services.sh
```

3. **Générer une licence de test** :
```bash
cd backend
npm run init-test-license
```

Le script lance automatiquement :
- Backend API (port 3001)
- Frontend Client (port 5173) 
- Admin Dashboard (port 5174)

### Services Disponibles

Après démarrage, accédez à :
- **Frontend Client** : http://localhost:5173
- **Dashboard Admin** : http://localhost:5174
- **API Backend** : http://localhost:3001/api
- **Interface de Test** : Ouvrir `test-all-features.html`

## 📖 Documentation

La documentation complète est disponible dans le dossier `docs/` :

- [`docs/README.md`](docs/README.md) - Index de la documentation
- [`docs/QUICK_START_GUIDE.md`](docs/QUICK_START_GUIDE.md) - 🚀 Guide de démarrage rapide (5 min)
- [`docs/FAQ.md`](docs/FAQ.md) - 🆕 Questions fréquentes et dépannage
- [`docs/AUTO_LICENSE_INITIALIZATION_SYSTEM.md`](docs/AUTO_LICENSE_INITIALIZATION_SYSTEM.md) - Système d'initialisation automatique
- [`UNIFIED_ECOSYSTEM_DOCUMENTATION.md`](docs/UNIFIED_ECOSYSTEM_DOCUMENTATION.md) - Architecture complète
- [`LOGIN_IMPLEMENTATION_REPORT.md`](docs/LOGIN_IMPLEMENTATION_REPORT.md) - Système d'authentification
- [`LICENSE_EDIT_FEATURE_REPORT.md`](docs/LICENSE_EDIT_FEATURE_REPORT.md) - Gestion des licences
- [`CHANGELOG.md`](CHANGELOG.md) - 📝 Historique des versions

### Navigation Rapide
```bash
./navigate.sh docs     # Ouvrir la documentation
./navigate.sh scripts  # Voir les scripts disponibles
./navigate.sh all      # Vue d'ensemble
```

## 🧪 Tests et Validation

### Interface de Test Complète
Le fichier `test-all-features.html` permet de :
- ✅ Valider les licences en temps réel
- ✅ Tester les fonctionnalités disponibles
- ✅ Vérifier les modules accessibles
- ✅ Contrôler les services externes
- ✅ Saisir des clés personnalisées

### Scripts de Test
```bash
./scripts/test-auth-admin.sh          # Test authentification admin
./scripts/test-integration.sh         # Tests d'intégration
./scripts/test-unified-ecosystem.sh   # Test écosystème complet
```

### Commandes de Licence de Test
```bash
# Dans le dossier backend/
npm run init-test-license      # Générer une licence de test (24h)
npm run test-license:generate  # Alternative pour générer
npm run test-license:status    # Voir le statut des licences
```

## 🔧 Scripts Utiles

### Gestion des Services
```bash
./start-all-services.sh    # Démarrer tout l'écosystème
./stop-all-services.sh     # Arrêter tous les services
./scripts/check-services.sh # Vérifier l'état des services
```

### Authentification
```bash
./scripts/start-auth-system.sh  # Démarrer backend + admin uniquement
./scripts/test-auth-admin.sh    # Créer un admin de test
```

## 📊 Licences de Test

### Génération Automatique
Le système génère automatiquement des licences de test de 24h :
```bash
cd backend
npm run init-test-license
```

### Licence de Test Actuelle
- **Durée** : 24 heures à partir de la génération
- **Domaine** : localhost
- **Fonctionnalités stratégiques** :
  - 🔍 **search** : Moteur de recherche avancé
  - 📤 **export** : Export de données (CSV, JSON)
  - 📊 **analytics** : Analytics et statistiques
  - 🔌 **api_access** : Accès complet à l'API

### Utilisation
1. **Frontend automatique** : Le frontend récupère automatiquement la licence active
2. **Manuel** : Cliquer sur "Utiliser la licence de test"
3. **API directe** : GET `/api/licenses/test-license`

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec hooks modernes
- **Tailwind CSS** pour le design
- **TypeScript** pour la sécurité des types

### Backend  
- **Node.js** + **Fastify**
- **Prisma ORM** + **PostgreSQL**
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **Zod** pour la validation des données

### DevOps
- **Scripts Bash** pour l'automatisation
- **Git** avec .gitignore optimisé
- **Documentation Markdown** complète

## 📝 Contexte Licence Pro

Ce projet a été développé dans le cadre d'une **licence professionnelle** et illustre :

- **Conception d'architecture** web moderne
- **Sécurisation d'applications** (JWT, bcrypt, validation)
- **Développement full-stack** React/Node.js
- **Gestion de projet** avec documentation complète
- **Déploiement et automatisation** avec scripts

## 🤝 Contribution

Pour contribuer au projet :
1. Forkez le repository
2. Créez une branche feature (`git checkout -b feature/ma-feature`)
3. Committez vos changements (`git commit -am 'Ajout de ma feature'`)
4. Poussez vers la branche (`git push origin feature/ma-feature`)
5. Ouvrez une Pull Request

## 📞 Contact

Pour toute question ou support :
- **Guide rapide** : [`docs/QUICK_START_GUIDE.md`](docs/QUICK_START_GUIDE.md)
- **FAQ** : [`docs/FAQ.md`](docs/FAQ.md) - Questions fréquentes
- **Documentation** : Voir le dossier `docs/`
- **Issues** : Utiliser les issues GitHub
- **Tests** : Lancer `test-all-features.html`

---

*Développé avec ❤️ dans le cadre d'une licence professionnelle*
