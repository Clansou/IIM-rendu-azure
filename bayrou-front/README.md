# Crypto Dashboard - Frontend

Dashboard interactif pour le suivi des cryptomonnaies développé avec React et déployé sur Azure Static Web Apps.

## 🚀 Technologies

- **React 19** - Framework UI moderne
- **Vite** - Build tool rapide
- **React Router** - Navigation côté client
- **Tailwind CSS** - Framework CSS utilitaire
- **Recharts** - Bibliothèque de graphiques pour React
- **Azure Static Web Apps** - Hébergement et déploiement

## 📱 Fonctionnalités

- **Dashboard principal** - Vue d'ensemble des cryptomonnaies populaires
- **Comparaison** - Outil de comparaison entre différentes cryptomonnaies
- **Graphiques interactifs** - Visualisation des données historiques
- **Mode sombre/clair** - Interface adaptative
- **Design responsive** - Compatible mobile et desktop

## 🛠️ Installation locale

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd rendu-terraform/frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
Créer un fichier `.env.local` :
```env
VITE_API_URL=http://localhost:3000/api
```

4. **Lancer en développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📦 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification du code
```

## 🏗️ Structure du projet

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── api/           # Services API
├── assets/        # Ressources statiques
├── App.jsx        # Composant principal
└── main.jsx       # Point d'entrée
```

## 🌐 Déploiement Azure

Le frontend est automatiquement déployé sur Azure Static Web Apps via GitHub Actions.

### Configuration requise :
- Azure Static Web Apps
- GitHub repository connecté
- Variables d'environnement configurées dans Azure

## 🔧 Configuration

### Variables d'environnement
- `VITE_API_URL` - URL de l'API backend

### Build settings Azure
- **App location**: `/frontend`
- **Output location**: `dist`
- **Build command**: `npm run build`

## 📝 Notes de développement

- Le projet utilise ESLint pour la qualité du code
- Tailwind CSS est configuré avec support du mode sombre
- React Router gère la navigation côté client
- Les graphiques sont générés avec Recharts

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
