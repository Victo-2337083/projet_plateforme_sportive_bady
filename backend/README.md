# backend

Backend Node.js + TypeScript + Express + Prisma.

## Démarrage rapide

```bash
# 1. Configure la base de données
cp .env.example .env
# Édite DATABASE_URL dans .env

# 2. Applique le schéma Prisma
npm run migrate

# 3. Lance le serveur
npm run dev
```

## Scripts disponibles

| Commande            | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Serveur de développement (nodemon)   |
| `npm run build`     | Compilation TypeScript               |
| `npm run start`     | Lance le build compilé               |
| `npm run migrate`   | Applique les migrations Prisma       |
| `npm run studio`    | Interface visuelle Prisma Studio     |
| `npm run generate`  | Régénère le client Prisma            |
| `npm run format`    | Formate le code avec Prettier        |

## Structure

```
src/
├── config/         # Prisma client (singleton)
├── controllers/    # Logique des requêtes HTTP
├── middlewares/    # errorHandler, notFound, validate
├── routes/         # Définition des routes
├── services/       # Logique métier (à compléter)
├── types/          # Types TypeScript partagés
└── utils/          # logger, response helpers
```

## Routes disponibles

| Méthode | Endpoint       | Description              |
|---------|----------------|--------------------------|
| GET     | /              | Santé de l'API           |
| GET     | /api/status    | Statut + connexion DB    |

