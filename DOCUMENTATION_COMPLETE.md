# 📚 Documentation Complète du Projet
## Stack Full-Stack : React + TypeScript + Vite (Frontend) | Node.js + Express + Prisma + MySQL (Backend)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du Projet](#architecture-du-projet)
3. [Frontend - Structure et Composants](#frontend---structure-et-composants)
4. [Backend - Structure et Composants](#backend---structure-et-composants)
5. [Dépendances et Packages](#dépendances-et-packages)
6. [Configuration et Fichiers](#configuration-et-fichiers)
7. [Guide d'Utilisation](#guide-dutilisation)
8. [Système de Gestion de Paquets (npm)](#système-de-gestion-de-paquets-npm)

---

## 🎯 Vue d'ensemble

Ce projet est une application full-stack moderne avec :
- **Frontend** : React 19 + TypeScript + Vite (outil de build ultra-rapide)
- **Backend** : Node.js + Express + TypeScript + Prisma ORM + MySQL
- **Communication** : API REST avec Axios
- **Routing** : React Router DOM
- **Validation** : Joi (backend) + TypeScript (frontend)

---

## 🏗️ Architecture du Projet

```
22/
├── frontend/          # Application React
│   ├── src/          # Code source
│   ├── public/       # Fichiers statiques
│   ├── dist/         # Build de production
│   └── node_modules/ # Dépendances
│
├── backend/           # API Node.js
│   ├── src/          # Code source
│   ├── prisma/       # Schéma et migrations Prisma
│   ├── dist/         # Build TypeScript compilé
│   └── node_modules/ # Dépendances
│
├── setup-frontend.sh # Script de création du frontend
└── setup-backend.sh  # Script de création du backend
```

---

## 🎨 Frontend - Structure et Composants

### 📁 Structure des Dossiers

```
frontend/src/
├── api/              # Configuration et appels API
│   └── axios.ts      # Instance Axios configurée avec intercepteurs
│
├── components/       # Composants React réutilisables
│   ├── common/       # Composants génériques (vide, à compléter)
│   └── layout/       # Composants de mise en page
│       └── Layout.tsx # Layout principal avec header/footer
│
├── hooks/            # Hooks React personnalisés
│   └── useApi.ts     # Hook générique pour les appels API
│
├── pages/            # Pages de l'application
│   ├── Home.tsx      # Page d'accueil
│   └── NotFound.tsx  # Page 404
│
├── store/            # État global (vide, à compléter avec Redux/Zustand)
│
├── types/            # Types TypeScript partagés
│   └── index.ts      # Interfaces et types (User, ApiResponse, etc.)
│
├── utils/            # Fonctions utilitaires
│   └── formatDate.ts # Formatage de dates en français
│
├── styles/           # Fichiers CSS/SCSS (vide, à compléter)
│
├── App.tsx           # Composant racine avec routes
├── main.tsx          # Point d'entrée de l'application
└── index.css         # Styles globaux
```

### 📄 Fichiers Principaux

#### `src/App.tsx`
**Rôle** : Composant racine qui configure le routing
- Utilise `BrowserRouter` de React Router
- Définit les routes principales
- Intègre le `Layout` pour toutes les pages
- Route 404 pour les pages inexistantes

**Routes configurées** :
- `/` → Page Home
- `*` → Page NotFound (404)

#### `src/api/axios.ts`
**Rôle** : Configuration centralisée d'Axios
- **Base URL** : `http://localhost:3000` (configurable via `.env`)
- **Intercepteur requête** : Ajoute automatiquement le token JWT dans les headers
- **Intercepteur réponse** : Gère les erreurs 401 (déconnexion automatique)

**Fonctionnalités** :
- Timeout de 10 secondes
- Headers JSON par défaut
- Gestion automatique de l'authentification

#### `src/hooks/useApi.ts`
**Rôle** : Hook personnalisé pour simplifier les appels API
- Gère l'état de chargement (`loading`)
- Gère les erreurs (`error`)
- Gère les données (`data`)
- Méthode `execute()` pour lancer les requêtes

**Utilisation** :
```typescript
const { data, loading, error, execute } = useApi<User>();
await execute(api.get('/users/1'));
```

#### `src/components/layout/Layout.tsx`
**Rôle** : Structure de base de toutes les pages
- Header avec navigation
- Zone principale (`<Outlet />` pour les routes enfants)
- Footer avec copyright

#### `src/pages/Home.tsx`
**Rôle** : Page d'accueil simple
- Message de bienvenue
- Indication de connexion au backend

#### `src/pages/NotFound.tsx`
**Rôle** : Page d'erreur 404
- Message d'erreur
- Lien de retour à l'accueil

#### `src/types/index.ts`
**Rôle** : Définitions TypeScript centralisées
- `User` : Interface utilisateur
- `ApiResponse<T>` : Format standardisé des réponses API
- `PaginatedResponse<T>` : Réponses paginées

#### `src/utils/formatDate.ts`
**Rôle** : Utilitaire de formatage de dates
- Format français (ex: "15 février 2024")
- Utilise `Intl.DateTimeFormat`

---

## ⚙️ Backend - Structure et Composants

### 📁 Structure des Dossiers

```
backend/src/
├── config/           # Configuration
│   └── prisma.ts     # Client Prisma (singleton pattern)
│
├── controllers/      # Logique des requêtes HTTP
│   └── status.controller.ts # Contrôleur exemple (health check)
│
├── middlewares/      # Middlewares Express
│   ├── errorHandler.ts # Gestion centralisée des erreurs
│   ├── notFound.ts    # Middleware 404
│   └── validate.ts     # Validation Joi générique
│
├── routes/           # Définition des routes
│   ├── index.ts      # Routeur principal
│   └── status.routes.ts # Routes de statut
│
├── services/         # Logique métier (vide, à compléter)
│
├── types/            # Types TypeScript partagés
│   └── index.ts      # Interfaces (ApiResponse, AuthRequest, etc.)
│
├── utils/            # Fonctions utilitaires
│   ├── logger.ts     # Système de logs
│   └── response.ts   # Helpers pour les réponses API
│
└── index.ts          # Point d'entrée principal (serveur Express)
```

### 📄 Fichiers Principaux

#### `src/index.ts`
**Rôle** : Point d'entrée du serveur Express
- Configure Express avec CORS, JSON parser
- Définit les routes (`/api/*`)
- Gère les erreurs (404, errorHandler)
- Démarre le serveur sur le port 3000

**Middlewares globaux** :
- `cors` : Autorise les requêtes depuis `http://localhost:5173`
- `express.json()` : Parse les body JSON (limite 10MB)
- `express.urlencoded()` : Parse les formulaires

**Routes** :
- `GET /` → Message de santé de l'API
- `GET /api/status` → Statut + test connexion DB

#### `src/config/prisma.ts`
**Rôle** : Client Prisma avec chargement différé
- Pattern singleton pour éviter les multiples instances
- Chargement différé pour permettre le démarrage sans DB
- Gestion des erreurs si la DB n'est pas configurée
- Logs conditionnels selon l'environnement

#### `src/controllers/status.controller.ts`
**Rôle** : Contrôleur pour le health check
- Teste la connexion à la base de données
- Retourne le statut de l'API et de la DB
- Gère les erreurs de connexion gracieusement

#### `src/middlewares/errorHandler.ts`
**Rôle** : Gestion centralisée des erreurs
- Capture toutes les erreurs non gérées
- Log les erreurs avec le logger
- Retourne une réponse JSON standardisée
- Support des erreurs personnalisées avec `statusCode`

#### `src/middlewares/notFound.ts`
**Rôle** : Gestion des routes inexistantes
- Retourne une erreur 404 standardisée
- Message : "Route introuvable"

#### `src/middlewares/validate.ts`
**Rôle** : Validation des données avec Joi
- Prend un schéma Joi en paramètre
- Valide le body de la requête
- Retourne les erreurs de validation détaillées
- Passe au middleware suivant si valide

**Utilisation** :
```typescript
router.post('/users', validate(userSchema), createUser);
```

#### `src/utils/logger.ts`
**Rôle** : Système de logs simple
- Format : `[ISO_TIMESTAMP] LEVEL message`
- Niveaux : `info`, `warn`, `error`
- Utilise `console.log/warn/error`

#### `src/utils/response.ts`
**Rôle** : Helpers pour standardiser les réponses API
- `sendSuccess()` : Réponse de succès (200 par défaut)
- `sendError()` : Réponse d'erreur (500 par défaut)
- Format : `{ success: boolean, data?: T, message?: string, errors?: string[] }`

#### `src/routes/index.ts`
**Rôle** : Routeur principal
- Centralise toutes les routes
- Préfixe `/api` appliqué dans `index.ts`
- Importe les sous-routeurs

#### `src/types/index.ts`
**Rôle** : Types TypeScript partagés
- `ApiResponse<T>` : Format standardisé des réponses
- `PaginationQuery` : Paramètres de pagination
- `AuthRequest` : Request Express avec utilisateur authentifié

---

## 📦 Dépendances et Packages

### Frontend (`frontend/package.json`)

#### Dépendances Principales (dependencies)
- **react** (^19.2.0) : Bibliothèque UI
- **react-dom** (^19.2.0) : Rendu React dans le DOM
- **react-router-dom** (^7.13.0) : Routing côté client
- **axios** (^1.13.5) : Client HTTP pour les appels API
- **lucide-react** (^0.563.0) : Bibliothèque d'icônes

#### Dépendances de Développement (devDependencies)
- **typescript** (~5.9.3) : Langage TypeScript
- **vite** (^7.3.1) : Build tool ultra-rapide
- **@vitejs/plugin-react** (^5.1.1) : Plugin React pour Vite
- **eslint** (^9.39.2) : Linter JavaScript/TypeScript
- **@eslint/js** (^9.39.2) : Configuration ESLint moderne
- **eslint-plugin-react-hooks** (^7.0.1) : Règles pour les hooks React
- **eslint-plugin-react-refresh** (^0.4.26) : Support HMR React
- **prettier** (^3.8.1) : Formateur de code
- **eslint-config-prettier** (^10.1.8) : Désactive ESLint en conflit avec Prettier
- **@types/node** (^24.10.13) : Types TypeScript pour Node.js

### Backend (`backend/package.json`)

#### Dépendances Principales (dependencies)
- **express** (^5.2.1) : Framework web Node.js
- **@prisma/client** (^7.4.0) : Client Prisma généré
- **dotenv** (^17.2.4) : Chargement des variables d'environnement
- **cors** (^2.8.6) : Middleware CORS
- **joi** (^18.0.2) : Validation de schémas

#### Dépendances de Développement (devDependencies)
- **typescript** (^5.9.3) : Langage TypeScript
- **ts-node** (^10.9.2) : Exécution TypeScript sans compilation
- **tsconfig-paths** (^4.2.0) : Support des paths TypeScript
- **nodemon** (^3.1.11) : Redémarrage automatique en développement
- **prisma** (^7.4.0) : CLI Prisma pour migrations et génération
- **@types/node** (^24.10.13) : Types TypeScript pour Node.js
- **@types/express** (^5.0.6) : Types TypeScript pour Express
- **@types/cors** (^2.8.19) : Types TypeScript pour CORS
- **eslint** (^10.0.0) : Linter
- **prettier** (^3.8.1) : Formateur de code
- **eslint-config-prettier** (^10.1.8) : Intégration ESLint/Prettier

---

## ⚙️ Configuration et Fichiers

### Frontend

#### `vite.config.ts`
**Rôle** : Configuration Vite
- Plugin React activé
- Optimisations de build

#### `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`
**Rôle** : Configuration TypeScript
- `tsconfig.json` : Configuration de base
- `tsconfig.app.json` : Config pour le code applicatif
- `tsconfig.node.json` : Config pour les scripts Node (Vite)

#### `.env` / `.env.example`
**Variables d'environnement** :
- `VITE_API_URL` : URL de l'API backend (défaut: `http://localhost:3000`)

#### `.prettierrc`
**Rôle** : Configuration Prettier
- Semicolons activés
- Guillemets simples
- Tabulation : 2 espaces
- Largeur max : 100 caractères

#### `.gitignore`
**Fichiers ignorés** :
- `node_modules/`
- `dist/`
- `.env` et variantes
- Fichiers de build

### Backend

#### `tsconfig.json`
**Rôle** : Configuration TypeScript
- Target : ES2020
- Module : CommonJS
- Output : `dist/`
- Paths : `@/*` → `src/*`
- Strict mode activé

#### `nodemon.json`
**Rôle** : Configuration Nodemon
- Surveille les fichiers `.ts` et `.json` dans `src/`
- Ignore les fichiers de test
- Commande : `ts-node -r tsconfig-paths/register src/index.ts`

#### `prisma/schema.prisma`
**Rôle** : Schéma de base de données Prisma
- Provider : MySQL
- Génère le client dans `node_modules/.prisma/client`

#### `prisma.config.ts`
**Rôle** : Configuration Prisma (Prisma 7)
- Chemin du schéma
- Chemin des migrations
- URL de la base de données depuis `.env`

#### `.env` / `.env.example`
**Variables d'environnement** :
- `PORT` : Port du serveur (défaut: 3000)
- `NODE_ENV` : Environnement (development/production)
- `CORS_ORIGIN` : Origine autorisée pour CORS (défaut: `http://localhost:5173`)
- `DATABASE_URL` : URL de connexion MySQL

**Format MySQL** :
```
mysql://USER:PASSWORD@localhost:3306/nom_db
```

#### `.prettierrc`
**Rôle** : Configuration Prettier (identique au frontend)

#### `.gitignore`
**Fichiers ignorés** :
- `node_modules/`
- `dist/`
- `.env` et variantes
- Fichiers générés Prisma

---

## 🚀 Guide d'Utilisation

### Prérequis
- **Node.js** 18+ installé
- **npm** (inclus avec Node.js)
- **MySQL** installé et démarré

### Installation

#### 1. Frontend
```bash
cd frontend
npm install
```

#### 2. Backend
```bash
cd backend
npm install
```

### Configuration

#### 1. Base de données MySQL
1. Crée une base de données :
```sql
CREATE DATABASE nom_de_ta_db;
```

2. Configure `.env` dans `backend/` :
```env
DATABASE_URL="mysql://root:ton_mot_de_passe@localhost:3306/nom_de_ta_db"
```

#### 2. Variables d'environnement Frontend
Le fichier `.env` est déjà configuré avec :
```env
VITE_API_URL=http://localhost:3000
```

### Démarrage

#### Frontend (Terminal 1)
```bash
cd frontend
npm run dev
```
→ Accessible sur `http://localhost:5173`

#### Backend (Terminal 2)
```bash
cd backend
npm run dev
```
→ Accessible sur `http://localhost:3000`

### Scripts Disponibles

#### Frontend
| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualise le build |
| `npm run lint` | Vérifie le code avec ESLint |

#### Backend
| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (nodemon) |
| `npm run build` | Compilation TypeScript |
| `npm run start` | Lance le build compilé |
| `npm run migrate` | Applique les migrations Prisma |
| `npm run studio` | Interface visuelle Prisma Studio |
| `npm run generate` | Régénère le client Prisma |
| `npm run format` | Formate le code avec Prettier |
| `npm run lint` | Vérifie le code avec ESLint |

### Création d'un Modèle Prisma

1. Édite `backend/prisma/schema.prisma` :
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. Crée la migration :
```bash
npm run migrate
```

3. Le client Prisma est automatiquement régénéré

### Utilisation de Prisma dans le Code

```typescript
import { prisma } from '../config/prisma';

// Créer
const user = await prisma.user.create({
  data: { email: 'test@example.com', name: 'Test' }
});

// Lire
const users = await prisma.user.findMany();

// Mettre à jour
await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Nouveau nom' }
});

// Supprimer
await prisma.user.delete({
  where: { id: 1 }
});
```

---

## 📦 Système de Gestion de Paquets (npm)

### Qu'est-ce que npm ?

**npm** (Node Package Manager) est le gestionnaire de paquets officiel de Node.js. Il permet de :
- Installer des bibliothèques (dépendances)
- Gérer les versions
- Exécuter des scripts
- Publier des packages

### Fichiers npm

#### `package.json`
**Rôle** : Manifeste du projet
- Liste des dépendances
- Scripts exécutables
- Métadonnées du projet (nom, version, etc.)

**Sections importantes** :
- `dependencies` : Packages nécessaires en production
- `devDependencies` : Packages nécessaires uniquement en développement
- `scripts` : Commandes personnalisées

#### `package-lock.json`
**Rôle** : Verrouillage des versions exactes
- Garantit la reproductibilité
- Définit les versions exactes de toutes les dépendances
- Généré automatiquement, ne pas modifier manuellement

### Commandes npm Essentielles

#### Installation
```bash
npm install              # Installe toutes les dépendances
npm install <package>    # Installe un package
npm install -D <package> # Installe en devDependencies
```

#### Scripts
```bash
npm run <script>         # Exécute un script défini dans package.json
npm start                # Alias pour npm run start
npm test                 # Alias pour npm run test
```

#### Gestion
```bash
npm update               # Met à jour les packages
npm outdated             # Liste les packages obsolètes
npm uninstall <package>  # Désinstalle un package
```

#### Informations
```bash
npm list                 # Liste les packages installés
npm list --depth=0       # Liste seulement les packages de premier niveau
npm info <package>       # Informations sur un package
```

### node_modules/

**Rôle** : Dossier contenant toutes les dépendances installées
- Créé automatiquement par `npm install`
- Ne jamais modifier manuellement
- Ignoré par Git (dans `.gitignore`)
- Peut être supprimé et régénéré avec `npm install`

### Versioning Semantique

Les versions suivent le format `MAJEUR.MINEUR.PATCH` :
- **MAJEUR** : Changements incompatibles
- **MINEUR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs

**Symboles dans package.json** :
- `^1.2.3` : Accepte les versions 1.x.x (mises à jour mineures et patches)
- `~1.2.3` : Accepte les versions 1.2.x (uniquement patches)
- `1.2.3` : Version exacte
- `*` : N'importe quelle version

---

## 🔧 Fonctionnalités Implémentées

### Frontend
✅ Structure de projet React + TypeScript + Vite
✅ Routing avec React Router DOM
✅ Configuration Axios avec intercepteurs
✅ Hook personnalisé `useApi` pour les appels API
✅ Layout réutilisable
✅ Pages Home et 404
✅ Types TypeScript centralisés
✅ Utilitaires (formatDate)
✅ Configuration ESLint + Prettier
✅ Variables d'environnement

### Backend
✅ Serveur Express avec TypeScript
✅ Architecture MVC
✅ Client Prisma configuré pour MySQL
✅ Middlewares (errorHandler, notFound, validate)
✅ Helpers de réponse standardisés
✅ Système de logs
✅ CORS configuré
✅ Validation avec Joi
✅ Route de health check
✅ Configuration ESLint + Prettier
✅ Variables d'environnement

---

## 📝 Notes Importantes

### Frontend
- Les variables d'environnement doivent commencer par `VITE_` pour être accessibles
- Vite utilise le HMR (Hot Module Replacement) pour le rechargement rapide
- Le build de production est optimisé automatiquement

### Backend
- Prisma 7 nécessite la configuration dans `prisma.config.ts` (pas dans le schéma)
- Le client Prisma est chargé de manière différée pour permettre le démarrage sans DB
- Les migrations Prisma créent l'historique dans `prisma/migrations/`

### Sécurité
- Les fichiers `.env` sont dans `.gitignore` (ne jamais les commiter)
- Les tokens JWT sont stockés dans `localStorage` (frontend)
- CORS est configuré pour limiter les origines autorisées

---

## 🎓 Prochaines Étapes Suggérées

### Frontend
- [ ] Ajouter un système d'authentification (login/register)
- [ ] Implémenter un store global (Redux, Zustand, ou Context API)
- [ ] Ajouter des composants UI (boutons, formulaires, modales)
- [ ] Implémenter la gestion d'état des formulaires
- [ ] Ajouter des tests (Vitest, React Testing Library)

### Backend
- [ ] Créer des modèles Prisma (User, Post, etc.)
- [ ] Implémenter l'authentification JWT
- [ ] Créer des routes CRUD complètes
- [ ] Ajouter la pagination
- [ ] Implémenter la gestion des fichiers (upload)
- [ ] Ajouter des tests (Jest, Supertest)

---

## 📞 Support

Pour toute question ou problème :
1. Vérifie les logs dans la console
2. Consulte la documentation officielle :
   - [React](https://react.dev)
   - [Vite](https://vite.dev)
   - [Prisma](https://www.prisma.io/docs)
   - [Express](https://expressjs.com)
   - [TypeScript](https://www.typescriptlang.org)

---

**Documentation générée le** : 2025-02-12
**Version du projet** : 1.0.0

---

## 📌 Résumé Rapide

### Frontend
- **Framework** : React 19 + TypeScript
- **Build Tool** : Vite 7
- **Routing** : React Router DOM 7
- **HTTP Client** : Axios
- **Port** : 5173

### Backend
- **Framework** : Express 5 + TypeScript
- **ORM** : Prisma 7
- **Base de données** : MySQL
- **Validation** : Joi
- **Port** : 3000

### Structure MVC Backend
- **Models** : Prisma (dans `prisma/schema.prisma`)
- **Views** : JSON responses (API REST)
- **Controllers** : Logique des requêtes HTTP
- **Routes** : Définition des endpoints
- **Middlewares** : Validation, erreurs, CORS
- **Services** : Logique métier (à compléter)

