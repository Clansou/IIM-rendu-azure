# Crypto Tracker - Backend API

API REST pour le suivi et l'analyse des cryptomonnaies, développée avec Node.js/Express et déployée sur Azure App Service.

## 🚀 Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimaliste
- **Azure Cosmos DB** - Base de données NoSQL
- **Redis** - Cache en mémoire
- **Azure App Service** - Hébergement cloud
- **Docker** - Conteneurisation

## 📡 Architecture

- **API REST** - Endpoints pour récupérer les données crypto
- **Cache Redis** - Optimisation des performances
- **Cosmos DB** - Stockage persistant des données
- **Jobs/Cron** - Récupération automatique des données
- **Logging** - Suivi des performances et erreurs

## 🛠️ Installation locale

### Prérequis
- Node.js 18+
- Redis (local ou cloud)
- Azure Cosmos DB (ou émulateur local)

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd rendu-terraform/backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
Créer un fichier `.env` :
```env
PORT=3000
NODE_ENV=development

# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE_ID=crypto-tracker
COSMOS_CONTAINER_ID=cryptos

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# API externes
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

4. **Démarrer Redis (local)**
```bash
npm run redis:start
```

5. **Lancer en développement**
```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`

## 📦 Scripts disponibles

```bash
npm start           # Serveur de production
npm run dev         # Serveur de développement avec nodemon
npm test            # Tests unitaires avec Jest
npm run lint        # Vérification du code
npm run fmt         # Formatage du code avec Prettier
npm run redis:start # Démarrer Redis local
npm run redis:stop  # Arrêter Redis local
npm run redis:flush # Vider le cache Redis
```

## 🌐 Endpoints API

### Cryptomonnaies
```
GET /api/cryptos           # Top cryptomonnaies
GET /api/history/:id       # Historique 7 jours d'une crypto
```

### Cache
```
GET /api/cache/status      # Statut du cache Redis
POST /api/cache/flush      # Vider le cache
```

### Santé
```
GET /api/health           # Statut de l'API
```

## 🏗️ Structure du projet

```
src/
├── config/           # Configuration (logger, etc.)
├── controllers/      # Contrôleurs des routes
├── jobs/            # Tâches automatisées (cron)
├── middlewares/     # Middlewares Express
├── models/          # Modèles de données
├── routes/          # Définition des routes
├── services/        # Services (Cosmos, Redis, etc.)
├── app.js           # Configuration Express
└── server.js        # Point d'entrée
```

## 🔄 Jobs automatisés

- **Récupération des données** - Toutes les 5 minutes depuis CoinGecko
- **Nettoyage du cache** - Quotidiennement
- **Alertes** - Monitoring des erreurs

## 🌐 Déploiement Azure

### Configuration App Service
- **Runtime**: Node.js 18
- **Build command**: `npm install`
- **Start command**: `npm start`

### Variables d'environnement Azure
Configurer dans Azure App Service → Configuration :
- `COSMOS_ENDPOINT`
- `COSMOS_KEY`
- `COSMOS_DATABASE_ID`
- `COSMOS_CONTAINER_ID`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoring

- **Logs structurés** - Winston logger
- **Métriques** - Performance et utilisation
- **Health checks** - Endpoint de santé
- **Error tracking** - Gestion centralisée des erreurs

## 🔧 Configuration

### Base de données Cosmos DB
- Database: `crypto-tracker`
- Container: `cryptos`
- Partition key: `/id`

### Cache Redis
- TTL par défaut: 5 minutes
- Clés structurées par endpoint

## 🧪 Tests

```bash
npm test              # Tous les tests
npm test -- --watch  # Mode watch
npm test controllers  # Tests des contrôleurs uniquement
```

## 📝 Logs

Les logs sont structurés et incluent :
- Niveau (info, warn, error)
- Timestamp
- Request ID
- Métadonnées contextuelles

## 🔒 Sécurité

- **Helmet** - Headers de sécurité
- **CORS** - Configuration cross-origin
- **Rate limiting** - Protection contre le spam
- **Input validation** - Validation des entrées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📚 Documentation API

Une documentation Swagger/OpenAPI est disponible sur `/api/docs` en environnement de développement.
