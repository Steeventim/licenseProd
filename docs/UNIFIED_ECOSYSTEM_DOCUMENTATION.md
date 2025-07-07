# Documentation d'Intégration - Écosystème Unifié de Gestion de Licences

## Vue d'ensemble

Cette documentation décrit l'intégration complète d'un système de validation de licence centralisé dans l'écosystème multi-modules de l'application. Tous les modules (Backend, Frontend, BackBPMF, FrontBPMF, Search Engine, Admin Dashboard) utilisent désormais une validation de licence unifiée.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Écosystème Unifié                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Backend   │  │  Frontend   │  │    Admin    │        │
│  │   (API)     │  │   (React)   │  │  Dashboard  │        │
│  │   :3001     │  │   :5173     │  │    :8080    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  BackBPMF   │  │  FrontBPMF  │  │   Search    │        │
│  │  (Fastify)  │  │   (React)   │  │   Engine    │        │
│  │   :3003     │  │   :5174     │  │  (Next.js)  │        │
│  └─────────────┘  └─────────────┘  │   :3002     │        │
│                                    └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│           Service Partagé de Validation                     │
│        shared/LicenseValidationService.js                  │
│                                                             │
│  • Validation centralisée des licences                     │
│  • Compatible CommonJS/ESM                                 │
│  • Gestion des fonctionnalités par licence                 │
│  • Cache intelligent des validations                       │
└─────────────────────────────────────────────────────────────┘
```

## Modules et Intégrations

### 1. Backend (API Principal) - Port 3001
**Fichiers modifiés :**
- `backend/src/routes/licenses.js` - API de gestion des licences
- `backend/src/server.js` - Enregistrement des routes

**Fonctionnalités :**
- Création, validation et gestion des licences
- API RESTful pour les opérations CRUD
- Base de données des licences et fonctionnalités

### 2. Service Partagé
**Fichier :** `shared/LicenseValidationService.js`

**Fonctionnalités :**
- Validation centralisée compatible avec tous les modules
- Support CommonJS et ESM
- Cache intelligent des validations
- Gestion des erreurs et retry automatique

### 3. BackBPMF (Serveur Fastify) - Port 3003
**Fichiers modifiés :**
- `BackBPMF/middleware/licenseMiddleware.js` - Middleware Fastify
- `BackBPMF/server.js` - Intégration du middleware

**Fonctionnalités :**
- Middleware Fastify pour toutes les routes
- Validation des fonctionnalités BPM et workflow
- Protection des APIs sensibles

### 4. Search Engine (Next.js) - Port 3002
**Fichiers modifiés :**
- `search-engine/middleware/licenseMiddleware.js` - Middleware Next.js
- `search-engine/middleware.ts` - Middleware global Next.js
- `search-engine/app/api/search/route.ts` - API de recherche
- `search-engine/app/license-required/page.tsx` - Page d'erreur

**Fonctionnalités :**
- Middleware global pour toutes les routes
- Protection des APIs de recherche
- Page d'erreur personnalisée pour les licences invalides
- Support des fonctionnalités de recherche avancée

### 5. FrontBPMF (Interface React) - Port 5174
**Fichiers modifiés :**
- `FrontBPMF/src/middleware/licenseMiddleware.jsx` - Provider React
- `FrontBPMF/src/App.tsx` - Intégration du provider
- `FrontBPMF/src/components/license/LicenseGuard.jsx` - Composants de garde

**Fonctionnalités :**
- Context React pour la gestion de licence
- Composants de garde pour protéger les fonctionnalités
- Hooks pour vérifier les fonctionnalités disponibles
- Interface utilisateur pour les erreurs de licence

### 6. Frontend Principal (Interface Unifiée) - Port 5173
**Fichiers modifiés :**
- `frontend/src/App.jsx` - Application unifiée
- `frontend/src/components/UnifiedApp.jsx` - Interface unifiée
- `frontend/src/hooks/useLicense.js` - Hook de licence
- `frontend/src/components/FeatureGuard.jsx` - Garde de fonctionnalités

**Fonctionnalités :**
- Interface unifiée regroupant tous les modules
- Gestion centralisée des fonctionnalités par licence
- Navigation dynamique selon les permissions
- Modules intégrés selon la licence utilisateur

## Fonctionnalités par Type de Licence

### Basic License
- Fonctionnalités de base
- Accès limité aux modules

### Standard License
- Toutes les fonctionnalités Basic
- Module de recherche
- Interface BPM de base

### Professional License
- Toutes les fonctionnalités Standard
- Recherche avancée
- Workflow complet
- Gestion multi-utilisateurs

### Enterprise License
- Toutes les fonctionnalités Professional
- BPM avancé
- Analytics et reporting
- Support prioritaire
- Intégrations personnalisées

## Configuration

### Variables d'Environnement

```bash
# Backend
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/licenses"

# License API URL (pour tous les modules)
LICENSE_API_URL="http://localhost:3001/api"

# Clé de chiffrement pour les licences
LICENSE_ENCRYPTION_KEY="your-encryption-key-here"

# Domaine autorisé
ALLOWED_DOMAIN="localhost"
```

### Ports des Services

```
Backend API:      3001
Frontend:         5173
Search Engine:    3002
BackBPMF:         3003
FrontBPMF:        5174
Admin Dashboard:  8080
```

## Utilisation

### 1. Démarrage de l'Écosystème

```bash
# Démarrer tous les services
./start-all-services.sh

# Ou individuellement
cd backend && npm start
cd frontend && npm run dev
cd search-engine && npm run dev
cd BackBPMF && npm start
cd FrontBPMF && npm run dev
cd admin-dashboard && npm run dev
```

### 2. Système d'Initialisation Automatique de Licences (🆕 v3.1)

Le système génère automatiquement des licences de test pour faciliter le développement :

```bash
# Génération automatique de licence de test (24h)
cd backend
npm run init-test-license

# Vérification du statut des licences
npm run test-license:status

# Alternative directe
node scripts/init-test-license.cjs generate
```

**Fonctionnalités de la licence de test :**
- **Durée** : 24 heures renouvelables
- **Domaine** : localhost
- **Features stratégiques** :
  - `search` : Moteur de recherche avancé
  - `export` : Export de données (CSV, JSON)
  - `analytics` : Analytics et statistiques  
  - `api_access` : Accès complet à l'API

**Intégration frontend automatique :**
- Le frontend récupère automatiquement la licence active via `/api/licenses/test-license`
- Bouton "Utiliser la licence de test" dans l'interface
- Fallback sur clé codée en dur si l'API échoue

### 3. Génération Manuelle d'une Licence

```bash
curl -X POST http://localhost:3001/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Ma Société",
    "email": "admin@societe.com",
    "domain": "localhost",
    "type": "enterprise",
    "features": ["search", "bpm", "workflow", "advanced-search", "advanced-bpm"],
    "maxUsers": 100,
    "validityDays": 365
  }'
```

### 4. Utilisation de la Licence

**Dans les APIs :**
```bash
curl -H "Authorization: Bearer YOUR_LICENSE_KEY" \
  http://localhost:3002/api/search?q=test
```

**Dans le Frontend :**
- Stocker la licence dans localStorage : `licenseKey`
- Ou passer en paramètre URL : `?licenseKey=YOUR_LICENSE_KEY`

### 4. Validation de la Licence

```bash
curl -X POST http://localhost:3001/api/licenses/validate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "YOUR_LICENSE_KEY",
    "requiredFeatures": ["search", "bpm"]
  }'
```

## Scripts de Test et Gestion

### Scripts Disponibles

```bash
# Démarrer tous les services
./start-all-services.sh

# Arrêter tous les services
./stop-all-services.sh

# Test d'intégration complet
./test-unified-ecosystem-complete.sh

# Test d'intégration simple
./test-integration.sh

# Vérifier l'intégration finale
./check-final-integration.sh
```

### Tests Automatisés

Le script `test-unified-ecosystem-complete.sh` effectue :
- Vérification de l'état de tous les services
- Génération d'une licence de test
- Test des middlewares dans tous les modules
- Validation des fonctionnalités par licence
- Test des APIs protégées
- Nettoyage automatique

## Sécurité

### Validation des Licences
- Chiffrement des licences avec clé secrète
- Validation du domaine d'utilisation
- Vérification de l'expiration
- Contrôle des fonctionnalités autorisées

### Protection des APIs
- Middleware sur toutes les routes sensibles
- Authentification par Bearer token
- Gestion des erreurs sécurisée
- Logs d'accès et d'erreurs

### Gestion des Erreurs
- Messages d'erreur standardisés
- Pages d'erreur personnalisées
- Fallback gracieux en cas de problème
- Retry automatique pour les validations

## Monitoring et Debugging

### Logs
Chaque module génère des logs pour :
- Validations de licence
- Erreurs d'authentification
- Accès aux fonctionnalités
- Performance des validations

### Health Checks
Points de contrôle disponibles :
- `GET /health` - État du service
- `GET /api/health` - État de l'API
- `GET /api/licenses/health` - État du système de licences

### Métriques
- Nombre de validations par minute
- Taux d'erreur des licences
- Utilisation des fonctionnalités
- Performance des middlewares

## Dépannage

### Problèmes Courants

**Licence non reconnue :**
- Vérifier la clé de licence
- Contrôler la date d'expiration
- Valider le domaine autorisé

**Service indisponible :**
- Vérifier l'état des ports
- Contrôler les logs du service
- Redémarrer le service concerné

**Middlewares non actifs :**
- Vérifier l'intégration dans le code
- Contrôler les imports des middlewares
- Valider la configuration

### Commandes de Debug

```bash
# Vérifier l'état des ports
./fix-ports.sh

# Logs des services
docker-compose logs -f [service_name]

# Test manuel d'une licence
curl -X POST http://localhost:3001/api/licenses/validate \
  -H "Content-Type: application/json" \
  -d '{"licenseKey": "YOUR_KEY", "requiredFeatures": ["search"]}'
```

## Développement

### Ajouter une Nouvelle Fonctionnalité

1. **Définir la fonctionnalité** dans le backend
2. **Ajouter au service partagé** si nécessaire
3. **Intégrer dans les middlewares** concernés
4. **Tester l'intégration** avec les scripts
5. **Documenter** la nouvelle fonctionnalité

### Ajouter un Nouveau Module

1. **Créer le middleware** spécifique au framework
2. **Intégrer le service partagé** 
3. **Ajouter aux scripts** de démarrage et test
4. **Configurer les ports** et variables d'environnement
5. **Tester l'intégration** complète

## Support

Pour toute question ou problème :
1. Consulter les logs des services
2. Exécuter les scripts de test
3. Vérifier la documentation des APIs
4. Contacter l'équipe de développement

---

**Version :** 1.0.0  
**Dernière mise à jour :** $(date)  
**Auteur :** Équipe de développement  
**Status :** Production Ready ✅
