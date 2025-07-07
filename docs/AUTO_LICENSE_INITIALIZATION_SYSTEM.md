# 🔧 Système d'Initialisation Automatique de Licences de Test

## 📋 Vue d'ensemble

Le système d'initialisation automatique de licences de test permet de générer facilement des licences temporaires pour le développement et les tests. Cette fonctionnalité a été développée pour simplifier le workflow de développement et garantir un environnement de test cohérent.

## 🎯 Objectifs

- **Automatisation** : Génération automatique de licences de test
- **Simplicité** : Interface en ligne de commande intuitive
- **Cohérence** : Licences avec fonctionnalités stratégiques prédéfinies
- **Temporalité** : Durée limitée (24h) pour éviter l'accumulation
- **Intégration** : Compatible avec tous les composants du système

## 🏗️ Architecture

```
📦 Système d'Initialisation
├── 🔧 backend/scripts/init-test-license.cjs    # Script principal
├── 📋 package.json                             # Commandes npm
├── 🔗 backend/src/routes/licenses.js           # Endpoint API
├── 🎨 frontend/src/hooks/useLicense.jsx        # Hook React
└── 🛡️ frontend/src/components/LicenseGuard.jsx # Composant garde
```

## ✨ Fonctionnalités

### 🔑 Génération Automatique
- **Clés uniques** : Génération cryptographique sécurisée
- **Format standardisé** : `LIC-TEST{timestamp}-{hash}`
- **Métadonnées** : Informations de traçabilité intégrées
- **Validation** : Vérification automatique de la conformité

### ⏰ Gestion Temporelle
- **Durée configurée** : 24 heures par défaut
- **Nettoyage automatique** : Suppression des licences expirées
- **Renouvellement** : Génération de nouvelles licences à la demande
- **Vérification d'état** : Contrôle des licences actives

### 🎨 Fonctionnalités Stratégiques
Les licences de test incluent des fonctionnalités choisies stratégiquement :

| Fonctionnalité | Description | Justification |
|---------------|-------------|---------------|
| `search` | Moteur de recherche avancé | Fonctionnalité de base pour les tests |
| `export` | Export de données (CSV, JSON) | Utile pour vérifier les données |
| `analytics` | Analytics et statistiques | Permet de tester les rapports |
| `api_access` | Accès complet à l'API | Essentiel pour les intégrations |

## 🚀 Utilisation

### Commandes NPM

```bash
# Génération d'une nouvelle licence de test
npm run init-test-license

# Alternative explicite
npm run test-license:generate

# Vérification du statut des licences
npm run test-license:status
```

### Script Direct

```bash
# Depuis le dossier backend/
node scripts/init-test-license.cjs generate
node scripts/init-test-license.cjs status
```

### Exemple de Sortie

```
🚀 Initialisation de la licence de test...
✅ Client de test existant trouvé : Client Test (ID: cmct3jd2m0000fmoqgnewqj1n)
🔄 Génération d'une nouvelle licence de test...

🎉 Licence de test créée avec succès !
📋 Détails de la licence :
   🔑 Clé : LIC-TESTMCT55VP9-0141C9E8DE1B9013E82DEBC4367A91A4
   👤 Client : Client Test
   🌐 Domaine : localhost
   📅 Créée le : 07/07/2025 15:33:09
   ⏰ Expire le : 08/07/2025 15:33:09
   🎯 Fonctionnalités :
      - 🔍 Moteur de recherche avancé
      - 📤 Export de données (CSV, JSON)
      - 📊 Analytics et statistiques
      - 🔌 Accès complet à l'API

💡 Pour utiliser cette licence dans le frontend :
   Clé à copier : LIC-TESTMCT55VP9-0141C9E8DE1B9013E82DEBC4367A91A4
   Ou cliquer sur "Utiliser la licence de test" dans l'interface
```

## 🔗 Intégration Frontend

### Récupération Automatique

Le frontend récupère automatiquement la licence de test active via l'endpoint `/api/licenses/test-license` :

```javascript
// Hook useLicense.jsx
const initializeLicense = async () => {
  try {
    // Tentative de récupération automatique
    const testLicenseResponse = await fetch(`${VITE_API_URL}/licenses/test-license`);
    if (testLicenseResponse.ok) {
      const testLicenseData = await testLicenseResponse.json();
      licenseKey = testLicenseData.licenseKey;
      localStorage.setItem('licenseKey', licenseKey);
    }
  } catch (error) {
    // Fallback sur clé codée en dur
  }
};
```

### Bouton de Test

Le composant `LicenseGuard` propose un bouton "Utiliser la licence de test" qui :
1. Tente de récupérer la licence active via l'API
2. Utilise une clé de fallback si l'API échoue
3. Pré-remplit le champ de saisie

## 📡 Endpoint API

### GET /api/licenses/test-license

Récupère la licence de test active pour le domaine `localhost`.

**Réponse Succès (200)** :
```json
{
  "success": true,
  "licenseKey": "LIC-TESTMCT55VP9-0141C9E8DE1B9013E82DEBC4367A91A4",
  "expiresAt": "2025-07-08T13:33:09.693Z",
  "features": ["search", "export", "analytics", "api_access"],
  "timeLeft": 24
}
```

**Réponse Erreur (404)** :
```json
{
  "error": "Aucune licence de test active trouvée"
}
```

## ⚙️ Configuration

### Variables d'Environnement

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3001/api
VITE_LICENSE_DOMAIN=localhost

# Backend (.env)
DATABASE_URL="postgresql://username:password@localhost:5432/licenses_db"
```

### Paramètres du Script

```javascript
// Fonctionnalités stratégiques
const TEST_FEATURES = [
  'search',          // Moteur de recherche
  'export',          // Export de données
  'analytics',       // Analytics
  'api_access'       // Accès API
];

// Durée de la licence (24 heures)
const TEST_LICENSE_DURATION_HOURS = 24;
```

## 🔄 Workflow de Développement

### 1. Démarrage de Projet
```bash
# 1. Démarrer les services
./start-all-services.sh

# 2. Générer une licence de test
cd backend && npm run init-test-license

# 3. Tester l'interface
# Ouvrir http://localhost:5173/
# Cliquer "Utiliser la licence de test"
```

### 2. Tests Quotidiens
```bash
# Vérifier le statut des licences
npm run test-license:status

# Renouveler si nécessaire
npm run init-test-license
```

### 3. Validation API
```bash
# Test direct via PowerShell/curl
Invoke-WebRequest -Uri "http://localhost:3001/api/licenses/test-license" -Method GET
```

## 🛠️ Maintenance

### Nettoyage Automatique

Le script supprime automatiquement :
- Les licences expirées lors de chaque génération
- Les anciennes métadonnées obsolètes
- Les entrées de base de données orphelines

### Monitoring

```bash
# Vérification du statut
npm run test-license:status

# Logs du backend
# Les validations apparaissent dans les logs du serveur backend
```

## 🐛 Dépannage

### Problèmes Courants

**Erreur "Client de test non trouvé"** :
```bash
# Solution : Le script crée automatiquement le client
npm run init-test-license
```

**Erreur "Base de données inaccessible"** :
```bash
# Solution : Vérifier PostgreSQL et migrer
npm run db:migrate
```

**Frontend ne récupère pas la licence** :
- Vérifier que le backend est démarré sur le port 3001
- Contrôler la variable `VITE_API_URL` dans frontend/.env
- Vérifier les logs du navigateur (F12)

### Logs de Débogage

```javascript
// Hook useLicense.jsx affiche automatiquement :
console.log('🎯 Licence de test automatique récupérée:', testLicenseData);
```

## 📈 Améliorations Futures

### Version 2.0
- [ ] **Configuration flexible** : Durée paramétrable
- [ ] **Fonctionnalités personnalisées** : Choix des features
- [ ] **Multi-domaines** : Support de plusieurs domaines de test
- [ ] **Interface graphique** : Dashboard pour la gestion des licences de test

### Version 3.0
- [ ] **Tests automatisés** : Validation continue
- [ ] **Métriques** : Statistiques d'utilisation des licences de test
- [ ] **Templates** : Modèles de licences prédéfinis
- [ ] **Intégration CI/CD** : Génération automatique en pipeline

## 📚 Références

### Documentation Liée
- [LICENSE_EDIT_FEATURE_REPORT.md](LICENSE_EDIT_FEATURE_REPORT.md) - Gestion des licences
- [INTERFACE_VALIDATION_LICENCE_REPORT.md](INTERFACE_VALIDATION_LICENCE_REPORT.md) - Validation côté client
- [UNIFIED_ECOSYSTEM_DOCUMENTATION.md](UNIFIED_ECOSYSTEM_DOCUMENTATION.md) - Architecture générale

### Code Source
- `backend/scripts/init-test-license.cjs` - Script principal
- `backend/src/routes/licenses.js` - API endpoints
- `frontend/src/hooks/useLicense.jsx` - Logique React
- `frontend/src/components/LicenseGuard.jsx` - Interface utilisateur

---

📅 **Créé le** : 7 juillet 2025  
🎯 **Statut** : ✅ Fonctionnel et documenté  
🔧 **Version** : 1.0.0
