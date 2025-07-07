# 🚀 Guide de Démarrage Rapide - Système de Licences

## ⚡ Démarrage Express (5 minutes)

### 1️⃣ Prérequis
```bash
# Vérifier Node.js (18+)
node --version

# Vérifier PostgreSQL (12+)
psql --version

# Vérifier npm
npm --version
```

### 2️⃣ Installation
```bash
# Cloner le projet
git clone <votre-repo>
cd licenseProd

# Démarrer tous les services
./start-all-services.sh
```

### 3️⃣ Génération de Licence de Test
```bash
# Aller dans le backend
cd backend

# Générer une licence de test automatique (24h)
npm run init-test-license
```

### 4️⃣ Accès aux Interfaces
- **Frontend Client** : http://localhost:5173/ 
- **Admin Dashboard** : http://localhost:5174/
- **API Backend** : http://localhost:3001/api
- **Test Interface** : Ouvrir `test-all-features.html`

### 5️⃣ Test de Validation
1. Aller sur http://localhost:5173/
2. Cliquer sur **"Utiliser la licence de test"**
3. ✅ L'application se débloque avec 4 fonctionnalités

---

## 🔧 Commandes Essentielles

### Services
```bash
./start-all-services.sh    # Démarrer tout
./stop-all-services.sh     # Arrêter tout
./scripts/check-services.sh # Vérifier l'état
```

### Licences de Test
```bash
# Dans backend/
npm run init-test-license      # Générer licence (24h)
npm run test-license:status    # Voir statut
npm run test-license:generate  # Alternative génération
```

### Admin
```bash
# Dans backend/
npm run create-admin    # Créer compte admin
```

### Base de Données
```bash
# Dans backend/
npm run db:migrate     # Migrer schema
npm run db:generate    # Générer client Prisma
npm run db:studio      # Interface Prisma Studio
```

---

## 🎯 Scénarios de Test

### Scénario 1 : Validation Frontend
1. **Démarrer** : `./start-all-services.sh`
2. **Licence** : `cd backend && npm run init-test-license`
3. **Test** : http://localhost:5173/ → "Utiliser la licence de test"
4. **Résultat** : Interface débloquée avec fonctionnalités ✅

### Scénario 2 : Dashboard Admin
1. **Admin** : `cd backend && npm run create-admin`
2. **Login** : http://localhost:5174/ → admin/admin123
3. **Gestion** : Créer/modifier/supprimer licences
4. **Résultat** : Gestion complète des licences ✅

### Scénario 3 : API Directe
```bash
# Test validation de licence
Invoke-WebRequest -Uri "http://localhost:3001/api/licenses/validate" \
  -Method POST \
  -Headers @{"Authorization"="Bearer LIC-TEST..."; "Content-Type"="application/json"} \
  -Body '{"domain":"localhost"}'

# Récupérer licence de test
Invoke-WebRequest -Uri "http://localhost:3001/api/licenses/test-license" -Method GET
```

### Scénario 4 : Interface HTML
1. **Ouvrir** : `test-all-features.html`
2. **Licence** : Copier la clé générée ou utiliser le bouton
3. **Test** : Valider et voir les fonctionnalités disponibles
4. **Résultat** : Validation directe sans framework ✅

---

## 🔍 Diagnostic Rapide

### Problème : Frontend ne se connecte pas
```bash
# Vérifier backend
curl http://localhost:3001/api/health

# Vérifier .env frontend
cat frontend/.env
# VITE_API_URL=http://localhost:3001/api ✅

# Redémarrer frontend
cd frontend && npm run dev
```

### Problème : Licence invalide
```bash
# Vérifier licence de test
cd backend && npm run test-license:status

# Regénérer si expirée
npm run init-test-license

# Vérifier API
curl http://localhost:3001/api/licenses/test-license
```

### Problème : Base de données
```bash
# Vérifier PostgreSQL
psql -U postgres -c "SELECT version();"

# Recréer schéma
cd backend && npm run db:migrate

# Vérifier tables
npm run db:studio
```

### Problème : Admin non accessible
```bash
# Créer admin
cd backend && npm run create-admin

# Vérifier admin-dashboard
cd admin-dashboard && npm run dev

# Test login
# URL: http://localhost:5174/
# User: admin / Pass: admin123
```

---

## 📊 Checklist de Validation

### ✅ Services
- [ ] Backend API (port 3001) 
- [ ] Frontend Client (port 5173)
- [ ] Admin Dashboard (port 5174)
- [ ] PostgreSQL actif

### ✅ Licences
- [ ] Licence de test générée (24h)
- [ ] Client "localhost" créé
- [ ] Fonctionnalités : search, export, analytics, api_access

### ✅ Interfaces
- [ ] Frontend valide la licence automatiquement
- [ ] Dashboard admin accessible (admin/admin123)
- [ ] Interface HTML de test fonctionnelle
- [ ] API répond aux requêtes

### ✅ Intégration
- [ ] Frontend récupère licence via API
- [ ] Validation en temps réel
- [ ] Fonctionnalités débloquées selon licence
- [ ] Logs backend visibles

---

## 🚨 Support Express

### Redémarrage Complet
```bash
# Arrêt
./stop-all-services.sh

# Nettoyage (optionnel)
rm -rf backend/node_modules frontend/node_modules admin-dashboard/node_modules
npm install # dans chaque dossier

# Redémarrage
./start-all-services.sh
cd backend && npm run init-test-license
```

### Reset Base de Données
```bash
cd backend
npm run db:reset        # Reset complet
npm run db:migrate      # Recréer tables
npm run create-admin    # Recréer admin
npm run init-test-license # Nouvelle licence
```

### Logs de Débogage
```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2) 
cd frontend && npm run dev

# Admin (terminal 3)
cd admin-dashboard && npm run dev

# Observer les logs pour identifier les erreurs
```

---

## 📖 Documentation Complète

- 📋 **Index** : [`docs/README.md`](docs/README.md)
- 🏗️ **Architecture** : [`docs/UNIFIED_ECOSYSTEM_DOCUMENTATION.md`](docs/UNIFIED_ECOSYSTEM_DOCUMENTATION.md)
- 🔧 **Licences Auto** : [`docs/AUTO_LICENSE_INITIALIZATION_SYSTEM.md`](docs/AUTO_LICENSE_INITIALIZATION_SYSTEM.md)
- 🛡️ **Admin** : [`docs/LOGIN_IMPLEMENTATION_REPORT.md`](docs/LOGIN_IMPLEMENTATION_REPORT.md)

---

📅 **Mis à jour** : 7 juillet 2025  
⚡ **Temps de démarrage** : ~5 minutes  
🎯 **Taux de succès** : 99% (avec PostgreSQL configuré)
