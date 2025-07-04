# 🖥️ Workflow de Test Visuel - Interfaces Intégrées

Ce guide vous permet de tester manuellement toutes les interfaces visuelles de l'écosystème unifié pour vérifier que le middleware de licence fonctionne correctement.

## 📋 Pré-requis

1. **Démarrer tous les services** :
```bash
cd /home/tims/Dev/Licenses_prod
./start-all-services.sh
```

2. **Vérifier que tous les services sont en marche** :
```bash
./test-unified-ecosystem-complete.sh
```

## 🎯 Tests Visuels par Interface

### 1. 🔧 **Backend API (Admin) - Port 3001**

**Objectif** : Vérifier la gestion des licences côté serveur

**URL** : `http://localhost:3001`

**Tests à effectuer** :
- [ ] **Test 1.1** : Accéder à `http://localhost:3001/health`
  - ✅ **Attendu** : `{"status":"ok","timestamp":"..."}`
  
- [ ] **Test 1.2** : Lister les clients
  ```bash
  curl -s http://localhost:3001/api/clients | jq
  ```
  - ✅ **Attendu** : Liste des clients avec leurs licences
  
- [ ] **Test 1.3** : Vérifier une licence
  ```bash
  curl -s "http://localhost:3001/api/licenses/verify?domain=localhost" | jq
  ```
  - ✅ **Attendu** : Licence valide avec fonctionnalités

### 2. 📊 **Admin Dashboard - Port 8080**

**Objectif** : Interface d'administration des licences

**URL** : `http://localhost:8080`

**Tests à effectuer** :
- [ ] **Test 2.1** : Ouvrir le navigateur sur `http://localhost:8080`
  - ✅ **Attendu** : Interface d'administration se charge
  
- [ ] **Test 2.2** : Vérifier la navigation
  - ✅ **Attendu** : Menus et liens fonctionnels
  
- [ ] **Test 2.3** : Tableau de bord des licences
  - ✅ **Attendu** : Statistiques et données visibles

### 3. 🏠 **Frontend Principal - Port 5173**

**Objectif** : Application principale avec protection de licence

**URL** : `http://localhost:5173`

**Tests à effectuer ÉTAPE PAR ÉTAPE** :

#### **Test 3.1 : Chargement initial**
- [ ] Ouvrir `http://localhost:5173`
- [ ] **Vérifier** : Page se charge sans erreur
- [ ] **Vérifier** : Composant LicenseGuard actif
- [ ] **Attendu** : 
  - ✅ Interface utilisateur visible
  - ✅ Message de licence (valide/invalide) affiché

#### **Test 3.2 : Navigation protégée**
- [ ] Essayer d'accéder aux fonctionnalités premium
- [ ] **Vérifier** : FeatureGuard bloque/autorise selon la licence
- [ ] **Attendu** :
  - ✅ Fonctionnalités autorisées : accessibles
  - ❌ Fonctionnalités non autorisées : bloquées

#### **Test 3.3 : Gestion d'état de licence**
- [ ] Observer le hook useLicense dans la console développeur
- [ ] **Vérifier** : État de licence mis à jour en temps réel
- [ ] **Attendu** :
  - ✅ `licenseValid: true/false`
  - ✅ `features: [...]`
  - ✅ `loading: false`

### 4. 🔍 **Search Engine - Port 3002**

**Objectif** : Moteur de recherche avec middleware Next.js

**URL** : `http://localhost:3002`

**Tests à effectuer** :

#### **Test 4.1 : Interface de recherche**
- [ ] Ouvrir `http://localhost:3002`
- [ ] **Vérifier** : Interface de recherche se charge
- [ ] **Attendu** : Formulaire de recherche visible

#### **Test 4.2 : Recherche avec licence**
- [ ] Taper une requête de recherche (ex: "test")
- [ ] Cliquer sur "Rechercher"
- [ ] **Vérifier** : Middleware vérifie la licence automatiquement
- [ ] **Attendu** :
  - ✅ Avec licence valide : Résultats affichés
  - ❌ Sans licence valide : Message d'erreur

#### **Test 4.3 : API de recherche directe**
```bash
# Test sans autorisation
curl -s "http://localhost:3002/api/search?q=test"

# Test avec licence (remplacer YOUR_LICENSE_KEY)
curl -s -H "Authorization: Bearer YOUR_LICENSE_KEY" "http://localhost:3002/api/search?q=test"
```

### 5. 📋 **BackBPMF - Port 3003**

**Objectif** : API BPM avec middleware Fastify

**URL** : `http://localhost:3003`

**Tests à effectuer** :

#### **Test 5.1 : Health check**
- [ ] Accéder à `http://localhost:3003/health`
- [ ] **Attendu** : `{"status":"ok","timestamp":"..."}`

#### **Test 5.2 : Protection des routes**
```bash
# Test sans licence
curl -s "http://localhost:3003/api/documents"

# Test avec licence
curl -s -H "Authorization: Bearer YOUR_LICENSE_KEY" "http://localhost:3003/api/documents"
```

#### **Test 5.3 : WebSocket (si applicable)**
- [ ] Ouvrir la console développeur
- [ ] Vérifier les connexions WebSocket
- [ ] **Attendu** : Connexions établies avec validation de licence

### 6. 🎨 **FrontBPMF - Port 5174**

**Objectif** : Interface BPM React avec LicenseProvider

**URL** : `http://localhost:5174`

**Tests à effectuer ÉTAPE PAR ÉTAPE** :

#### **Test 6.1 : Chargement et licence**
- [ ] Ouvrir `http://localhost:5174`
- [ ] **Vérifier** : Page se charge
- [ ] **Vérifier** : LicenseProvider initialisé
- [ ] **Attendu** : Interface BPM visible avec statut de licence

#### **Test 6.2 : Fonctionnalités BPM**
- [ ] Naviguer vers les modules BPM (documents, processus)
- [ ] **Vérifier** : LicenseGuard protège les fonctionnalités
- [ ] **Attendu** :
  - ✅ Fonctionnalités "bmp" : accessibles
  - ❌ Fonctionnalités non autorisées : bloquées

#### **Test 6.3 : Communication avec BackBPMF**
- [ ] Effectuer une action qui appelle BackBPMF (ex: charger des documents)
- [ ] **Vérifier** : Requêtes incluent l'autorisation
- [ ] **Attendu** : Communication fluide avec propagation de licence

## 🔄 **Workflow d'Intégration Complete**

### Scénario complet : "Recherche puis traitement BPM"

#### **Étape 1** : Recherche initiale
1. Aller sur `http://localhost:5173` (Frontend principal)
2. Utiliser la fonction de recherche intégrée
3. **Vérifier** : Redirection vers Search Engine si nécessaire

#### **Étape 2** : Traitement des résultats
1. Sélectionner un résultat de recherche
2. Cliquer sur "Traiter avec BPM"
3. **Vérifier** : Redirection vers FrontBPMF

#### **Étape 3** : Workflow BPM
1. Sur `http://localhost:5174` (FrontBPMF)
2. Créer un nouveau processus à partir du document
3. **Vérifier** : Communication avec BackBPMF API

#### **Étape 4** : Validation finale
1. Vérifier que toutes les étapes sont tracées
2. **Vérifier** : Logs de licence dans tous les modules
3. **Attendu** : Workflow complet avec protection de licence

## 🚨 **Tests d'Erreurs et Edge Cases**

### **Test E1 : Licence expirée**
1. Modifier temporairement la date d'expiration dans la DB
2. Recharger les interfaces
3. **Attendu** : Messages d'erreur cohérents sur toutes les interfaces

### **Test E2 : Licence révoquée**
1. Révoquer une licence via l'API
2. Tester toutes les interfaces
3. **Attendu** : Accès bloqué immédiatement

### **Test E3 : Fonctionnalité non autorisée**
1. Essayer d'accéder à une fonctionnalité non incluse dans la licence
2. **Attendu** : FeatureGuard bloque avec message explicite

### **Test E4 : Perte de connexion**
1. Arrêter temporairement le Backend API
2. Tester les interfaces
3. **Attendu** : Messages d'erreur gracieux, retry automatique

## 📊 **Checklist de Validation**

### ✅ **Intégration Frontend ↔ Backend**
- [ ] useLicense hook fonctionne
- [ ] LicenseGuard protège les composants
- [ ] FeatureGuard gère les fonctionnalités
- [ ] Messages d'erreur cohérents

### ✅ **Intégration Search Engine**
- [ ] Middleware Next.js actif
- [ ] API de recherche protégée
- [ ] Interface utilisateur réactive

### ✅ **Intégration BPM**
- [ ] FrontBPMF ↔ BackBPMF communication
- [ ] Middleware Fastify fonctionnel
- [ ] WebSocket avec licence (si applicable)

### ✅ **Expérience Utilisateur**
- [ ] Navigation fluide entre interfaces
- [ ] Messages d'erreur clairs et utiles
- [ ] Performance acceptable
- [ ] Responsive design

## 🎯 **Commandes Utiles pour le Debug**

### Vérifier les logs en temps réel
```bash
# Backend API
tail -f /home/tims/Dev/Licenses_prod/logs/backend.log

# BackBPMF
tail -f /home/tims/Dev/Licenses_prod/logs/BackBPMF.log

# Search Engine
tail -f /home/tims/Dev/Licenses_prod/logs/SearchEngine.log

# Frontend
tail -f /home/tims/Dev/Licenses_prod/logs/frontend.log
```

### Obtenir une licence de test
```bash
curl -s -X GET "http://localhost:3001/api/clients" | jq '.clients[0].licenses[0].key'
```

### Test rapide de toutes les APIs
```bash
LICENSE_KEY="YOUR_LICENSE_KEY"
echo "Backend:" && curl -s -H "Authorization: Bearer $LICENSE_KEY" "http://localhost:3001/api/licenses" | jq .
echo "Search:" && curl -s -H "Authorization: Bearer $LICENSE_KEY" "http://localhost:3002/api/search?q=test" | jq .
echo "BackBPMF:" && curl -s -H "Authorization: Bearer $LICENSE_KEY" "http://localhost:3003/health" | jq .
```

## 🏁 **Critères de Réussite**

✅ **Test réussi si** :
1. Toutes les interfaces se chargent correctement
2. Le middleware de licence fonctionne sur tous les modules
3. La navigation entre interfaces est fluide
4. Les fonctionnalités sont correctement protégées
5. Les messages d'erreur sont cohérents et utiles
6. Les performances sont acceptables

❌ **Test échoué si** :
1. Une interface ne se charge pas
2. Le middleware de licence est contournable
3. Des erreurs JavaScript/React non gérées
4. Communication inter-modules défaillante
5. Incohérences dans la gestion des licences

---

**💡 Conseil** : Effectuez ces tests dans l'ordre pour une validation complète de l'écosystème unifié !
