# 🚀 Système de Gestion de Licences Étendu

Un système complet de gestion de licences pour applications web, étendu avec des modules de gestion documentaire, recherche intelligente et BPM.

## 🌟 Vue d'Ensemble

Ce projet combine un système principal de gestion de licences avec des modules spécialisés pour créer une plateforme complète de gestion d'entreprise :

- **🔐 Système Principal** : Gestion des licences, clients, authentification
- **📄 BackBPMF** : Gestion documentaire avancée avec workflow
- **🔍 Search Engine** : Moteur de recherche intelligent avec IA
- **⚙️ FrontBPMF** : Interface de Business Process Management

## 🏗️ Architecture

### Services Principaux
- **Backend API** (Port 3001) : API Fastify + Prisma + PostgreSQL
- **Admin Dashboard** (Port 3002) : Interface d'administration React
- **Frontend Client** (Port 3003) : Interface utilisateur React

### Modules Intégrés
- **BackBPMF** (Port 3004) : API Fastify pour gestion documentaire
- **Search Engine** (Port 3005) : Application Next.js avec Elasticsearch
- **FrontBPMF** (Port 5173) : Interface React/TypeScript pour BPM

## 📁 Structure du projet

```
Licenses_prod/
├── backend/                 # API Fastify
│   ├── src/
│   │   ├── config/         # Configuration
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Services métier
│   │   └── server.js       # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma   # Schéma base de données
│   └── package.json
├── frontend/               # Application React client
│   ├── src/
│   │   ├── components/     # Composants de licence
│   │   ├── contexts/       # Contexte React de licence
│   │   ├── services/       # Services API
│   │   └── App.jsx
│   └── package.json
├── admin-dashboard/        # Dashboard d'administration
│   ├── src/
│   │   ├── components/     # Composants admin
│   │   ├── services/       # Services API admin
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### 1. Backend API

```bash
cd backend
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# Générer et appliquer le schéma Prisma
npm run db:generate
npm run db:push

# Démarrer le serveur en mode développement
npm run dev
```

L'API sera disponible sur http://localhost:3001

### 2. Frontend client

```bash
cd frontend
npm install

# Démarrer l'application
npm run dev
```

L'application sera disponible sur http://localhost:3003

### 3. Dashboard admin

```bash
cd admin-dashboard
npm install

# Démarrer le dashboard
npm run dev
```

Le dashboard sera disponible sur http://localhost:3002

## 🔐 Configuration de sécurité

### Variables d'environnement Backend (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/license_db"
JWT_SECRET="votre-cle-jwt-secrete-tres-longue"
PORT=3001
NODE_ENV="development"

# Configuration email (optionnel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Configuration Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## 📚 Utilisation

### 1. Créer un client

Via le dashboard admin ou l'API :

```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mon Client",
    "email": "client@example.com",
    "domain": "example.com"
  }'
```

### 2. Créer une licence

```bash
curl -X POST http://localhost:3001/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "cuid-du-client",
    "features": ["basic", "bpm", "search"],
    "expiresAt": "2025-12-31T23:59:59.000Z"
  }'
```

### 3. Intégrer dans une application React

```jsx
import { LicenseProvider, LicenseGuard, FeatureGuard } from './license-system';

function App() {
  return (
    <LicenseProvider>
      <LicenseGuard fallback={<LicenseForm />}>
        <FeatureGuard feature="bpm">
          <BPMComponent />
        </FeatureGuard>
      </LicenseGuard>
    </LicenseProvider>
  );
}
```

### 4. Valider une licence côté client

```jsx
const { validateLicense, hasFeature } = useLicense();

// Validation manuelle
await validateLicense("LIC-XXXXXXXXX");

// Vérification de fonctionnalité
if (hasFeature('export')) {
  // Afficher le bouton d'export
}
```

## 🛠️ Endpoints API

### Licences

- `POST /api/licenses` - Créer une licence
- `POST /api/licenses/validate` - Valider une licence (avec header `Authorization: Bearer <LICENSE_KEY>`)
- `POST /api/licenses/revoke` - Révoquer une licence
- `POST /api/licenses/ping` - Ping d'utilisation
- `GET /api/licenses/:id` - Détails d'une licence
- `GET /api/licenses` - Liste des licences (admin)

### Clients

- `POST /api/clients` - Créer un client
- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `PUT /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

## 🔒 Sécurité

### Fonctionnalités de sécurité

- **JWT signé** pour mode offline sécurisé
- **Validation de domaine** optionnelle
- **Expiration automatique** des licences
- **Révocation** en temps réel
- **Logs d'utilisation** avec IP et User-Agent
- **Nettoyage automatique** des anciens logs

### Mode offline

Le système génère un JWT signé permettant la validation offline :

```javascript
// Validation offline automatique si l'API est indisponible
const offlineValidation = LicenseService.verifyOfflineToken(storedJWT);
```

## 📊 Fonctionnalités avancées

### Tâches programmées (Cron)

- Vérification des licences expirées (toutes les heures)
- Nettoyage des anciens logs (chaque dimanche)
- Notifications d'expiration par email (quotidien)

### Système de notifications

- Email automatique avant expiration (7 jours)
- Notification de création de licence
- Notification de révocation

### Analytics et logs

- Logs d'utilisation détaillés
- Statistiques d'usage par licence
- Tableau de bord admin avec métriques

## 🚦 États des licences

- `ACTIVE` - Licence active et valide
- `SUSPENDED` - Licence temporairement suspendue
- `REVOKED` - Licence définitivement révoquée
- `EXPIRED` - Licence expirée (automatique)

## 🔧 Fonctionnalités gérées

Le système supporte différentes fonctionnalités modulaires :

- `basic` - Fonctionnalités de base
- `bpm` - Business Process Management
- `search` - Recherche avancée
- `export` - Export de données
- `analytics` - Analytics et rapports

## 📝 Logs et monitoring

Tous les appels API sont loggés avec :

- Timestamp
- Adresse IP
- User-Agent
- Statut de la requête
- ID de licence

## 🌐 Déploiement en production

### Backend

1. Configurer les variables d'environnement de production
2. Utiliser une base PostgreSQL sécurisée
3. Configurer HTTPS avec certificat SSL
4. Utiliser PM2 ou Docker pour la gestion des processus

### Frontend

1. Builder l'application : `npm run build`
2. Servir les fichiers statiques via nginx/apache
3. Configurer l'URL de l'API de production

### Sécurisation

- Utiliser des secrets JWT robustes (256 bits minimum)
- Configurer CORS strictement
- Implémenter rate limiting
- Monitoring des logs d'accès

## 🤝 Support

Ce système fournit une base solide pour la gestion de licences. Il peut être étendu selon vos besoins spécifiques :

- Intégration avec Stripe pour la facturation
- Webhook pour génération automatique de licences
- API REST complète pour intégrations tierces
- Dashboard analytics avancé

## 📄 Licence

Ce projet est fourni sous licence MIT.
