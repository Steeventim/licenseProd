# ❓ FAQ - Questions Fréquentes

## 🚀 Démarrage

### Q: Comment démarrer rapidement le projet ?
**R:** Suivez le guide de démarrage rapide :
```bash
./start-all-services.sh
cd backend && npm run init-test-license
```
Puis allez sur http://localhost:5173/ et cliquez "Utiliser la licence de test".

### Q: Quels sont les prérequis ?
**R:** 
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn
- Port 3001, 5173, 5174 disponibles

### Q: Où trouver la documentation complète ?
**R:** Consultez [`docs/README.md`](docs/README.md) pour l'index complet, ou [`docs/QUICK_START_GUIDE.md`](docs/QUICK_START_GUIDE.md) pour un démarrage express.

---

## 🔑 Licences de Test

### Q: Comment générer une licence de test ?
**R:** 
```bash
cd backend
npm run init-test-license
```
La licence est automatiquement générée pour 24h avec les fonctionnalités : search, export, analytics, api_access.

### Q: Pourquoi ma licence de test ne fonctionne plus ?
**R:** Les licences de test expirent après 24h. Régénérez-en une :
```bash
npm run test-license:status    # Vérifier l'état
npm run init-test-license      # Régénérer
```

### Q: Comment voir quelles licences sont actives ?
**R:** 
```bash
cd backend
npm run test-license:status
```

### Q: Puis-je personnaliser la durée des licences de test ?
**R:** Oui, modifiez `TEST_LICENSE_DURATION_HOURS` dans `backend/scripts/init-test-license.cjs`.

---

## 🛠️ Services et Ports

### Q: Sur quels ports tournent les services ?
**R:**
- Backend API : 3001
- Frontend Client : 5173  
- Admin Dashboard : 5174
- (Optionnel) Search Engine : 3002
- (Optionnel) BackBPMF : 3003

### Q: Comment vérifier si tous les services sont actifs ?
**R:**
```bash
./scripts/check-services.sh
```

### Q: Un service ne démarre pas, que faire ?
**R:**
1. Vérifiez les ports disponibles : `netstat -tulpn | grep :3001`
2. Vérifiez les logs : regardez les terminaux de chaque service
3. Redémarrez : `./stop-all-services.sh` puis `./start-all-services.sh`

---

## 🎨 Frontend

### Q: Le frontend ne récupère pas la licence automatiquement ?
**R:** Vérifiez :
1. Backend actif sur port 3001 : `curl http://localhost:3001/api/health`
2. Variable d'environnement : `cat frontend/.env` → `VITE_API_URL=http://localhost:3001/api`
3. Licence de test active : `npm run test-license:status`

### Q: Message "Not Found" dans l'interface ?
**R:** Problème d'URL API. Vérifiez que `VITE_API_URL` dans `frontend/.env` contient `/api` à la fin.

### Q: Comment utiliser une licence personnalisée ?
**R:** 
1. Saisissez la clé manuellement dans l'interface
2. Ou modifiez `localStorage.setItem('licenseKey', 'VOTRE_CLE')`
3. Ou utilisez l'interface de test HTML : `test-all-features.html`

---

## 🛡️ Administration

### Q: Comment accéder au dashboard admin ?
**R:** 
1. Créez un compte admin : `cd backend && npm run create-admin`
2. Allez sur http://localhost:5174/
3. Connectez-vous : admin / admin123

### Q: J'ai oublié le mot de passe admin ?
**R:** Recréez le compte :
```bash
cd backend
npm run create-admin
```

### Q: Comment créer une licence depuis le dashboard ?
**R:** 
1. Connectez-vous au dashboard
2. Section "Licences" → "Créer"
3. Remplissez les champs et validez

---

## 🔧 API Backend

### Q: Comment tester l'API directement ?
**R:**
```bash
# Vérifier santé
curl http://localhost:3001/api/health

# Récupérer licence de test
curl http://localhost:3001/api/licenses/test-license

# Valider licence
curl -X POST http://localhost:3001/api/licenses/validate \
  -H "Authorization: Bearer VOTRE_CLE" \
  -H "Content-Type: application/json" \
  -d '{"domain":"localhost"}'
```

### Q: Erreur 401 "Token de licence requis" ?
**R:** Ajoutez le header Authorization :
```bash
-H "Authorization: Bearer VOTRE_CLE_DE_LICENCE"
```

### Q: Erreur 403 "DOMAIN_MISMATCH" ?
**R:** Utilisez le bon domaine dans la requête :
```json
{"domain": "localhost"}
```

---

## 🗄️ Base de Données

### Q: Comment réinitialiser la base de données ?
**R:**
```bash
cd backend
npm run db:reset        # Reset complet
npm run db:migrate      # Recréer les tables
npm run create-admin    # Recréer l'admin
npm run init-test-license # Nouvelle licence
```

### Q: Comment voir les données en base ?
**R:**
```bash
cd backend
npm run db:studio
```
Puis ouvrez http://localhost:5555

### Q: Erreur de connexion PostgreSQL ?
**R:** 
1. Vérifiez que PostgreSQL est actif : `psql -U postgres -c "SELECT version();"`
2. Vérifiez `DATABASE_URL` dans `backend/.env`
3. Testez la connexion : `npm run db:generate`

---

## 🧪 Tests et Validation

### Q: Comment tester toutes les fonctionnalités ?
**R:** Utilisez l'interface de test complète :
1. Ouvrez `test-all-features.html` dans un navigateur
2. Utilisez une licence de test ou saisissez une clé
3. Testez toutes les fonctionnalités disponibles

### Q: Comment automatiser les tests ?
**R:**
```bash
./scripts/test-integration.sh          # Tests d'intégration
./scripts/test-unified-ecosystem.sh    # Test écosystème complet
./scripts/test-auth-admin.sh           # Test authentification
```

### Q: Interface de test ne fonctionne pas ?
**R:**
1. Vérifiez que le backend est actif
2. Utilisez la bonne clé de licence
3. Regardez la console du navigateur (F12) pour les erreurs

---

## 🔒 Sécurité

### Q: Les licences sont-elles sécurisées ?
**R:** Oui :
- Génération cryptographique avec `crypto.randomBytes()`
- Validation côté serveur obligatoire
- JWT pour l'authentification admin
- Hachage bcrypt des mots de passe

### Q: Puis-je utiliser en production ?
**R:** Avec adaptations :
- Changez les secrets dans `.env`
- Configurez un vrai domaine (pas localhost)
- Utilisez HTTPS
- Renforcez la sécurité PostgreSQL

---

## ⚡ Performance

### Q: L'application est lente ?
**R:**
1. Vérifiez les ressources système
2. Consultez les logs pour les erreurs
3. Optimisez PostgreSQL si nécessaire
4. Utilisez le cache des validations

### Q: Trop de requêtes de validation ?
**R:** Le système intègre un cache intelligent. Vérifiez la configuration dans `shared/LicenseValidationService.js`.

---

## 🔄 Développement

### Q: Comment contribuer au projet ?
**R:**
1. Forkez le repository
2. Créez une branche feature
3. Suivez les conventions de code
4. Ajoutez des tests si nécessaire
5. Soumettez une Pull Request

### Q: Structure des fichiers importante ?
**R:** Oui, respectez :
```
backend/           # API et logique serveur
frontend/          # Interface React client  
admin-dashboard/   # Interface React admin
docs/              # Documentation
scripts/           # Scripts d'automatisation
shared/            # Services partagés
```

### Q: Comment ajouter une nouvelle fonctionnalité ?
**R:**
1. Définissez la fonctionnalité dans le système de licences
2. Implémentez côté backend (API)
3. Ajoutez la logique frontend
4. Mettez à jour la documentation
5. Testez l'intégration complète

---

## 📞 Support

### Q: Où signaler un bug ?
**R:** 
1. Vérifiez d'abord cette FAQ
2. Consultez [`CHANGELOG.md`](CHANGELOG.md) pour les problèmes connus
3. Ouvrez une issue GitHub avec :
   - Description du problème
   - Étapes de reproduction
   - Logs d'erreur
   - Environnement (OS, Node.js, etc.)

### Q: Comment obtenir de l'aide ?
**R:**
1. **Documentation** : [`docs/`](docs/) pour guides détaillés
2. **Guide rapide** : [`docs/QUICK_START_GUIDE.md`](docs/QUICK_START_GUIDE.md)
3. **Issues GitHub** : Pour bugs et demandes de fonctionnalités
4. **Code source** : Tous les fichiers sont commentés

### Q: Le projet évolue-t-il encore ?
**R:** Oui ! Consultez [`CHANGELOG.md`](CHANGELOG.md) pour les dernières versions et [`docs/README.md`](docs/README.md) pour la roadmap.

---

## 💡 Conseils Pro

### Q: Meilleures pratiques pour le développement ?
**R:**
- Toujours démarrer avec une licence de test fraîche
- Utiliser les scripts unifiés (`./start-all-services.sh`)
- Consulter les logs en cas de problème
- Tester avec l'interface HTML avant le frontend React
- Sauvegarder la base de données avant modifications importantes

### Q: Comment optimiser mon workflow ?
**R:**
```bash
# Alias recommandés (ajoutez à votre .bashrc/.zshrc)
alias lstart="./start-all-services.sh"
alias lstop="./stop-all-services.sh" 
alias ltest="cd backend && npm run init-test-license"
alias lstatus="cd backend && npm run test-license:status"
```

---

📅 **Dernière mise à jour** : 7 juillet 2025  
💬 **Questions supplémentaires** ? Consultez [`docs/README.md`](docs/README.md) ou ouvrez une issue GitHub !
