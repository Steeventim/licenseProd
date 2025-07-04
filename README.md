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

### 🛡️ Dashboard Administrateur
- **Authentification sécurisée** (JWT + bcrypt)
- **Gestion complète des licences** (CRUD)
- **Interface d'édition avancée** avec validation
- **Feedback utilisateur** en temps réel

### 🔧 Backend API
- **Architecture RESTful** avec Express.js
- **Base de données PostgreSQL** avec Prisma ORM
- **Authentification JWT** sécurisée
- **Validation robuste** des licences
- **Gestion des erreurs** centralisée

### 📊 Système de Licences
- **Génération de clés** sécurisées
- **Validation en temps réel** 
- **Gestion des expirations**
- **Fonctionnalités modulaires** (basic, analytics, export, reports, etc.)

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js** 18+ 
- **PostgreSQL** 12+
- **npm** ou **yarn**

### Installation Rapide

1. **Cloner le projet** :
```bash
git clone <votre-repo>
cd Licenses_prod
```

2. **Démarrer tous les services** :
```bash
./start-all-services.sh
```

Le script lance automatiquement :
- Backend API (port 3001)
- Frontend Client (port 5173) 
- Admin Dashboard (port 5174)

### Services Disponibles

Après démarrage, accédez à :
- **Frontend Client** : http://localhost:5173
- **Dashboard Admin** : http://localhost:5174
- **API Backend** : http://localhost:3001
- **Interface de Test** : Ouvrir `test-all-features.html`

## 📖 Documentation

La documentation complète est disponible dans le dossier `docs/` :

- [`docs/README.md`](docs/README.md) - Index de la documentation
- [`UNIFIED_ECOSYSTEM_DOCUMENTATION.md`](docs/UNIFIED_ECOSYSTEM_DOCUMENTATION.md) - Architecture complète
- [`LOGIN_IMPLEMENTATION_REPORT.md`](docs/LOGIN_IMPLEMENTATION_REPORT.md) - Système d'authentification
- [`LICENSE_EDIT_FEATURE_REPORT.md`](docs/LICENSE_EDIT_FEATURE_REPORT.md) - Gestion des licences

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

### Scripts de Test
```bash
./scripts/test-auth-admin.sh          # Test authentification admin
./scripts/test-integration.sh         # Tests d'intégration
./scripts/test-unified-ecosystem.sh   # Test écosystème complet
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

## 📊 Licence de Test

Une licence de démonstration est incluse :
```
Clé : LIC-MCDMX42E-00F4248D-7C3B859A-F12E63D8
Fonctionnalités : basic, bpm, search, export, analytics, reports, documents
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec hooks modernes
- **Tailwind CSS** pour le design
- **TypeScript** pour la sécurité des types

### Backend  
- **Node.js** + **Express.js**
- **Prisma ORM** + **PostgreSQL**
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe

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
- **Documentation** : Voir le dossier `docs/`
- **Issues** : Utiliser les issues GitHub
- **Tests** : Lancer `test-all-features.html`

---

*Développé avec ❤️ dans le cadre d'une licence professionnelle*
