# 📝 CHANGELOG - Système de Gestion de Licences

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-07-07 - 🆕 SYSTÈME D'INITIALISATION AUTOMATIQUE

### 🎉 Ajouté
- **Système d'initialisation automatique de licences de test**
  - Script `backend/scripts/init-test-license.cjs` pour génération automatique
  - Commandes npm intégrées : `init-test-license`, `test-license:generate`, `test-license:status`
  - Endpoint API `/api/licenses/test-license` pour récupération automatique
  - Durée configurable (24h par défaut) avec nettoyage automatique des licences expirées

- **Fonctionnalités stratégiques pour licences de test**
  - `search` : Moteur de recherche avancé
  - `export` : Export de données (CSV, JSON)  
  - `analytics` : Analytics et statistiques
  - `api_access` : Accès complet à l'API

- **Intégration frontend automatique**
  - Récupération automatique de licence via API dans `useLicense.jsx`
  - Bouton "Utiliser la licence de test" amélioré dans `LicenseGuard.jsx`
  - Fallback intelligent sur clé codée en dur

- **Documentation complète**
  - Guide détaillé : `AUTO_LICENSE_INITIALIZATION_SYSTEM.md`
  - Guide de démarrage rapide : `QUICK_START_GUIDE.md`
  - Mise à jour de tous les README et index

### 🔧 Modifié
- **Backend**
  - Correction des références Prisma (`isActive` → `status`, `licenseKey` → `key`)
  - Ajout endpoint `/api/licenses/test-license` dans `routes/licenses.js`
  - Amélioration gestion des erreurs et validation des champs

- **Frontend**
  - Hook `useLicense.jsx` avec récupération automatique de licence
  - Composant `LicenseGuard.jsx` avec API call pour licence de test
  - Configuration `.env` mise à jour (`VITE_LICENSE_DOMAIN=localhost`)

- **Configuration**
  - Scripts npm standardisés dans `package.json`
  - Variables d'environnement optimisées
  - Domaine unifié sur `localhost` pour tous les composants

- **Documentation**
  - README principal mis à jour avec nouvelles fonctionnalités
  - Index de documentation enrichi
  - Chronologie des versions actualisée

### 🐛 Corrigé
- Problème de validation côté frontend (domaine `test.local` → `localhost`)
- Erreurs Prisma avec champs inexistants (`isActive`, `licenseKey`)
- Configuration d'URL API incohérente entre composants
- Gestion des licences expirées dans l'interface de test

### 📚 Documentation
- Guide de démarrage rapide (5 minutes)
- Documentation système d'initialisation automatique
- Scénarios de test détaillés
- Checklist de validation complète

---

## [3.0.0] - 2025-07-04 - UNIFICATION SERVICES

### 🎉 Ajouté
- **Scripts unifiés de démarrage**
  - `start-all-services.sh` pour démarrage global
  - `stop-all-services.sh` pour arrêt propre
  - `scripts/check-services.sh` pour monitoring

- **Dashboard Admin restructuré**
  - Navigation par hash URL synchronisée
  - Interface d'édition de licences complète
  - Feedback utilisateur en temps réel

- **Interface client modernisée**
  - Design Tailwind CSS unifié
  - Sidebar responsive améliorée
  - Garde de fonctionnalités dynamique

### 🔧 Modifié
- Architecture des composants simplifiée
- Configuration des ports standardisée
- Scripts de test et validation unifiés

### 🐛 Corrigé
- Problèmes de synchronisation navigation admin
- Conflits de ports entre services
- Validation de licence côté client

---

## [2.0.0] - 2025-06-15 - AUTHENTIFICATION & GESTION

### 🎉 Ajouté
- **Système d'authentification admin**
  - JWT sécurisé avec refresh tokens
  - Hachage bcrypt des mots de passe
  - Interface de connexion React

- **Fonctionnalité d'édition des licences**
  - CRUD complet pour les licences
  - Interface graphique d'administration
  - Validation avancée des données

- **Écosystème unifié**
  - Service de validation partagé
  - Intégration multi-modules
  - Cache intelligent des validations

### 🔧 Modifié
- Migration vers Prisma ORM
- Architecture RESTful améliorée
- Gestion centralisée des erreurs

### 🐛 Corrigé
- Vulnérabilités de sécurité
- Performance des requêtes DB
- Synchronisation des états

---

## [1.0.0] - 2025-06-01 - VERSION INITIALE

### 🎉 Ajouté
- **Architecture de base**
  - Backend Node.js + Express
  - Frontend React + Tailwind
  - Base de données PostgreSQL

- **Services intégrés**
  - API de gestion des licences
  - Interface utilisateur de base
  - Système de validation

- **Interface client initiale**
  - Validation de licence basique
  - Fonctionnalités modulaires
  - Design responsive

### 🔧 Technique
- Setup initial du projet
- Configuration Docker
- Documentation de base

---

## Types de changements

- `🎉 Ajouté` pour les nouvelles fonctionnalités
- `🔧 Modifié` pour les changements de fonctionnalités existantes  
- `🐛 Corrigé` pour les corrections de bugs
- `🗑️ Supprimé` pour les fonctionnalités supprimées
- `🔒 Sécurité` en cas de vulnérabilités
- `📚 Documentation` pour les améliorations de docs
- `⚡ Performance` pour les optimisations

---

## Conventions de version

Ce projet utilise [Semantic Versioning](https://semver.org/) :

- **MAJOR** version quand vous faites des changements incompatibles de l'API
- **MINOR** version quand vous ajoutez des fonctionnalités rétrocompatibles  
- **PATCH** version quand vous faites des corrections rétrocompatibles

**Format** : `MAJOR.MINOR.PATCH` (ex: 3.1.0)

---

## Liens utiles

- **Code source** : Repository principal
- **Issues** : Tracker GitHub
- **Documentation** : [`docs/README.md`](docs/README.md)
- **Guide rapide** : [`docs/QUICK_START_GUIDE.md`](docs/QUICK_START_GUIDE.md)

---

📅 **Dernière mise à jour** : 7 juillet 2025  
🎯 **Version actuelle** : 3.1.0  
👥 **Mainteneurs** : Équipe de développement Licence Pro
