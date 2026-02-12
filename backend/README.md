# Back_End_Web3

Base backend prête à développer avec **Node.js + TypeScript + Express + Prisma + MySQL**.

## Installation

```bash
npm install
cp .env.example .env
```

Renseigne ensuite `DATABASE_URL` dans `.env`.

## Démarrage

```bash
npm run dev
```

## Scripts

- `npm run dev` : lance le serveur avec nodemon
- `npm run build` : compile TypeScript
- `npm run start` : démarre la version compilée
- `npm run generate` : génère le client Prisma
- `npm run migrate` : applique les migrations

## Structure

```txt
src/
├── common/
├── models/
├── public/
├── repos/
├── routes/
├── services/
├── views/
├── index.ts
├── server.ts
└── swagger.yaml
```
