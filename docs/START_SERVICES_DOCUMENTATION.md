# DOCUMENTATION - SCRIPT DE DÉMARRAGE UNIFIÉ

## 📋 PRÉSENTATION

Le script `start-all-services.sh` est maintenant le **point d'entrée unique** pour démarrer l'ensemble de l'écosystème de gestion de licences. Il rassemble toutes les fonctionnalités des anciens scripts :

- ✅ `start.sh` - Services principaux
- ✅ `start-auth-system.sh` - Système d'authentification
- ✅ `start-services-correct-ports.sh` - Configuration des ports

## 🚀 UTILISATION

### Démarrage complet
```bash
./start-all-services.sh
```

### Arrêt complet
```bash
./stop-all-services.sh
```

## 🎯 SERVICES DÉMARRÉS

| Service | Port | Description | URL |
|---------|------|-------------|-----|
| **Backend API** | 3001 | API de gestion des licences | http://localhost:3001 |
| **Frontend Client** | 5173 | Interface utilisateur moderne | http://localhost:5173 |
| **Admin Dashboard** | 8080 | Administration (Faubell7/Z04y627$) | http://localhost:8080 |
| **Search Engine** | 3000 | Moteur de recherche IA | http://localhost:3000 |
| **BackBPMF** | 3003/3004 | Gestion documentaire DGI | http://localhost:3003 |
| **FrontBPMF** | 5174 | Interface BPM | http://localhost:5174 |

## 🎨 FONCTIONNALITÉS DU SCRIPT

### ✅ Améliorations apportées

1. **Affichage coloré** : Messages d'état avec codes couleur
2. **Gestion d'erreurs robuste** : Détection et rapport des échecs
3. **Vérification des prérequis** : Node.js, npm, dossiers
4. **Attente intelligente** : Vérification que les services démarrent
5. **Ports alternatifs** : BackBPMF peut utiliser 3003 ou 3004
6. **Rapport détaillé** : État final de tous les services
7. **Installation automatique** : Dependencies si nécessaire

### 🔧 Fonctions principales

- `check_port()` - Vérification de disponibilité des ports
- `wait_for_service()` - Attente du démarrage avec timeout
- `start_service()` - Démarrage unifié des services
- `print_status()` - Affichage coloré des statuts

## 📊 MODES D'UTILISATION

### 🎯 Mode Développement (recommandé)
```bash
./start-all-services.sh
```
- Tous les services en mode développement
- Hot reload activé
- Logs détaillés dans `./logs/`

### 🔐 Mode Administration uniquement
```bash
./start-auth-system.sh  # Ancien script, gardé pour compatibilité
```
- Backend API + Admin Dashboard seulement
- Authentification admin

### 📱 Mode Client uniquement
```bash
cd frontend && npm run dev
```
- Interface client seulement
- Nécessite Backend API actif

## 🗂️ STRUCTURE DES LOGS

```
logs/
├── Backend-API.log         # API de gestion des licences
├── Frontend-Client.log     # Interface utilisateur
├── Admin-Dashboard.log     # Dashboard administrateur
├── SearchEngine.log        # Moteur de recherche IA
├── BackBPMF.log           # Gestion documentaire
├── FrontBPMF.log          # Interface BPM
├── Backend-API.pid        # Process IDs pour arrêt
├── Frontend-Client.pid
└── ...
```

## 🔍 DÉPANNAGE

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   netstat -tuln | grep -E ':(3001|3000|3003|5173|5174|8080)'
   ./stop-all-services.sh
   ./start-all-services.sh
   ```

2. **Dependencies manquantes**
   ```bash
   cd [service-directory]
   npm install
   ```

3. **Service qui ne démarre pas**
   ```bash
   tail -f logs/[Service-Name].log
   ```

### Commandes utiles

```bash
# Voir tous les services Node.js
ps aux | grep node

# Arrêter un service spécifique
kill $(cat logs/Backend-API.pid)

# Vérifier les ports occupés
netstat -tuln | grep LISTEN

# Redémarrage propre
./stop-all-services.sh && sleep 3 && ./start-all-services.sh
```

## 🎁 FONCTIONNALITÉS AVANCÉES

### Tests intégrés
- **test-all-features.html** : Test complet des licences
- **Interface de test** : http://localhost:5173/test-license-interface.html

### Monitoring
- Logs centralisés dans `./logs/`
- PIDs sauvegardés pour arrêt propre
- Vérification automatique des services

### Licence de test
```
Clé : LIC-MCDMX42E-00F4248D-7C3B859A-F12E63D8
Fonctionnalités : basic, bpm, search, export, analytics, reports, documents
Client : Client Test (test@example.com)
```

## 📈 ÉVOLUTIONS FUTURES

- [ ] Support Docker Compose
- [ ] Configuration par variables d'environnement
- [ ] Monitoring temps réel
- [ ] Scripts de mise à jour automatique
- [ ] Sauvegarde/restauration des données

## 💡 NOTES

- Le script détecte automatiquement l'environnement
- Compatible avec tous les anciens scripts
- Fonctionne avec ou sans Docker
- Gestion intelligente des conflits de ports
- Arrêt propre avec `./stop-all-services.sh`

---

**Version** : 3.0  
**Date** : 4 juillet 2025  
**Compatibilité** : Linux, macOS, WSL  
**Dépendances** : Node.js 18+, npm 8+
