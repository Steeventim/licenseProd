# 📖 Guide d'Utilisation du Système Intégré

## 🚀 Démarrage Rapide

### 1. Démarrage de Tous les Services

```bash
# Démarrer tous les services en une commande
./start-all-services.sh
```

### 2. Arrêt de Tous les Services

```bash
# Arrêter tous les services proprement
./stop-all-services.sh
```

### 3. Test d'Intégration

```bash
# Vérifier que tout fonctionne correctement
./test-integration.sh
```

## 📋 Services Disponibles

### Système Principal de Gestion de Licences

#### Backend API (Port 3001)
- **URL** : http://localhost:3001
- **Santé** : http://localhost:3001/health
- **API** : http://localhost:3001/api/
- **Endpoints** :
  - `GET /api/licenses` - Liste des licences
  - `POST /api/licenses` - Créer une licence  
  - `POST /api/licenses/validate` - Valider une licence
  - `POST /api/licenses/revoke` - Révoquer une licence
  - `DELETE /api/licenses/:id` - Supprimer une licence
  - `GET /api/clients` - Liste des clients
  - `POST /api/clients` - Créer un client

#### Admin Dashboard (Port 3002)
- **URL** : http://localhost:3002
- **Fonctionnalités** :
  - Gestion des clients
  - Création/modification/suppression des licences
  - Statistiques et métriques
  - Logs d'utilisation

#### Frontend Client (Port 3003)
- **URL** : http://localhost:3003
- **Fonctionnalités** :
  - Interface utilisateur pour les clients
  - Validation de licence
  - Utilisation des fonctionnalités sous licence
  - Guard système (LicenseGuard, FeatureGuard)

### Nouveaux Modules Intégrés

#### BackBPMF - Gestion Documentaire (Port 3004)
- **URL** : http://localhost:3004
- **Fonctionnalités** :
  - Gestion des documents
  - Workflow de validation
  - Authentification JWT
  - Système de rôles
  - Upload de fichiers
  - Notifications temps réel

#### Search Engine - Recherche Intelligente (Port 3005)
- **URL** : http://localhost:3005
- **Fonctionnalités** :
  - Recherche en temps réel
  - Elasticsearch integration
  - Prévisualisation PDF
  - Administration avancée
  - Statistiques de recherche

#### FrontBPMF - Interface BPM (Port 5173)
- **URL** : http://localhost:5173
- **Fonctionnalités** :
  - Business Process Management
  - Interface React/TypeScript
  - Assistant de configuration
  - Gestion des workflows

## 🔧 Commandes Utiles

### Gestion des Services

```bash
# Démarrer seulement le système principal
./start.sh

# Vérifier l'état des ports
netstat -tuln | grep -E ":(3001|3002|3003|3004|3005|5173)" | grep LISTEN

# Voir les processus Node.js
ps aux | grep node | grep -v grep

# Voir les logs d'un service
tail -f logs/[nom-service].log

# Tuer un processus spécifique
kill $(cat logs/[nom-service].pid)
```

### Développement

```bash
# Démarrer un service individuellement
cd backend && npm run dev
cd admin-dashboard && npm run dev  
cd frontend && npm run dev
cd BackBPMF && npm run dev
cd FrontBPMF && npm run dev
cd search-engine && npm run dev
```

### Tests et Validation

```bash
# Test complet d'intégration
./test-integration.sh

# Test API spécifique
curl -X GET http://localhost:3001/health
curl -X GET http://localhost:3001/api/licenses

# Test de création de client
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Client","email":"test@example.com","domain":"test.com"}'
```

## 🔐 Authentification et Sécurité

### Système Principal (Licences)
- **JWT** avec clés de licence
- **Validation** par domaine et IP
- **Révocation** en temps réel
- **Logs** d'utilisation

### BackBPMF (Documents)
- **JWT** indépendant
- **Rôles** et permissions
- **Reset** mot de passe
- **Upload** sécurisé

### Intégration Future
- **SSO** (Single Sign-On) planifié
- **Gateway API** pour unifier l'auth
- **Propagation** des permissions

## 📊 Monitoring et Logs

### Fichiers de Logs
```bash
logs/
├── Backend API.log
├── Admin Dashboard.log  
├── Frontend Client.log
├── BackBPMF.log
├── FrontBPMF.log
└── SearchEngine.log
```

### Métriques Disponibles
- **Licences** : Créations, validations, révocations
- **Utilisateurs** : Connexions, activité
- **Documents** : Uploads, consultations  
- **Recherches** : Requêtes, popularité

## 🚨 Dépannage

### Problèmes Courants

#### Port déjà utilisé
```bash
# Identifier le processus
lsof -ti:3001

# Tuer le processus
kill -9 $(lsof -ti:3001)

# Ou utiliser le script de correction
./fix-ports.sh
```

#### Service ne répond pas
```bash
# Vérifier l'état
curl -I http://localhost:3001/health

# Redémarrer le service
./stop-all-services.sh
./start-all-services.sh
```

#### Base de données
```bash
# Vérifier la connexion Prisma
cd backend && npx prisma db pull

# Synchroniser le schéma
npx prisma generate
```

### Support et Contact

Pour toute question ou problème :
1. Consulter les logs : `tail -f logs/[service].log`
2. Exécuter les tests : `./test-integration.sh`
3. Vérifier la documentation des modules individuels

## 🔄 Workflow d'Intégration Type

### 1. Création d'un Client avec Licence
```bash
# 1. Créer un client
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Client Pro","email":"pro@example.com","domain":"pro.example.com"}'

# 2. Créer une licence pour le client
curl -X POST http://localhost:3001/api/licenses \
  -H "Content-Type: application/json" \
  -d '{"clientId":"[CLIENT_ID]","features":["basic","bpm","search","documents"]}'

# 3. Valider la licence
curl -X POST http://localhost:3001/api/licenses/validate \
  -H "Authorization: Bearer [LICENSE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"domain":"pro.example.com"}'
```

### 2. Utilisation des Services Intégrés
1. **Validation de licence** via l'API principale
2. **Accès aux documents** via BackBPMF (si licence valide)
3. **Recherche intelligente** via Search Engine
4. **Gestion BPM** via FrontBPMF

Cette architecture permet une gestion centralisée des licences avec des services spécialisés pour chaque fonctionnalité métier.
