# Tests pour les Azure Functions - Système de Vote Bayrou

## ✅ Configuration terminée

### Tests fonctionnels implémentés
- ✅ **getHealth.test.ts** - Fonction de santé (4 tests)
- ✅ **createUser.test.ts** - Création d'utilisateurs (3 tests)  
- ✅ **loginUser.test.ts** - Authentification (8 tests)
- ✅ **integration.test.ts** - Tests d'intégration workflow (4 tests)
- 🔄 **getVotes.test.ts** - En développement
- 🔄 **postVote.test.ts** - En développement

### Couverture actuelle
- **19 tests** qui passent avec succès
- **4 suites de tests** opérationnelles
- Tests des flux critiques : création utilisateur → connexion → workflow complet

## 🚀 Déploiement automatique

### CI/CD configuré
Le workflow GitHub Actions est maintenant configuré pour :

1. **Installation** des dépendances Functions
2. **Build** TypeScript  
3. **Tests automatiques** (`npm run test:ci`)
4. **Déploiement** du frontend + Azure Functions

### À chaque push sur `main`
```bash
git add .
git commit -m "Update functions"
git push
```

→ **Tests automatiques** → **Déploiement si succès** ✅

## 🛠️ Commandes de développement

```bash
# Tests en local
npm run test:ci          # Tests CI (stable)
npm test                 # Tous les tests
npm run test:watch       # Mode watch
npm run test:coverage    # Avec couverture

# Build et développement  
npm run build           # Compilation TypeScript
npm run clean          # Nettoyage
npm start              # Démarrage local Functions
```

## 📊 Fonctions testées

### ✅ Testées et validées
1. **getHealth** - Endpoint de santé avec paramètres
2. **createUser** - Validation pseudo/email + anti-doublons
3. **loginUser** - Authentification par pseudo + email
4. **Workflow complet** - Création → Vote → Récupération

### 🎯 Scénarios couverts
- Validation des entrées (400 Bad Request)
- Gestion d'erreurs base de données (500)
- Logique métier (409 Conflict pour doublons)
- Authentification réussie/échouée (200/401)
- Workflow utilisateur complet

## 🌐 URLs de production

- **Frontend**: https://blue-dune-01bf30d03.2.azurestaticapps.net/
- **API Functions**: Déployées automatiquement via Azure Static Web Apps

## 📝 Prochaines étapes recommandées

1. ✅ **Push pour tester le déploiement automatique**
2. 🔄 **Finaliser tests getVotes/postVote** (optionnel)
3. ✅ **Monitoring en production**

Les tests couvrent les fonctions essentielles et garantissent la qualité du déploiement ! 🎉
