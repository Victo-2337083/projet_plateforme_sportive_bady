#!/bin/bash
# =============================================================
# setup-backend.sh — Scaffold Node.js + TypeScript + Prisma
# Usage: bash setup-backend.sh [nom-du-projet]
# =============================================================

set -e  # Arrêter le script à la première erreur

# ─── Couleurs pour les messages ───────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✔]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✘]${NC} $1"; exit 1; }
info()  { echo -e "${BLUE}[→]${NC} $1"; }

# ─── Vérification des prérequis ───────────────────────────────
info "Vérification des prérequis..."
command -v node >/dev/null 2>&1 || error "Node.js est requis. Installe-le sur https://nodejs.org"
command -v npm  >/dev/null 2>&1 || error "npm est requis."

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  error "Node.js 18+ est requis. Version actuelle : $(node -v)"
fi
log "Node.js $(node -v) détecté"

# ─── Nom du projet ─────────────────────────────────────────────
PROJECT_NAME="${1:-backend}"

if [ -d "$PROJECT_NAME" ]; then
  error "Le dossier '$PROJECT_NAME' existe déjà. Choisis un autre nom ou supprime-le."
fi

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Création du projet : $PROJECT_NAME ${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ─── 1. Initialisation du projet ──────────────────────────────
info "Initialisation du projet Node.js..."
mkdir -p "$PROJECT_NAME" && cd "$PROJECT_NAME"
npm init -y
log "package.json créé"

# ─── 2. Installation des dépendances ──────────────────────────
info "Installation des dépendances principales..."
npm install express dotenv cors joi
log "Dépendances installées"

info "Installation des dépendances de développement..."
npm install -D \
  typescript \
  ts-node \
  tsconfig-paths \
  @types/node \
  @types/express \
  @types/cors \
  nodemon \
  prisma \
  eslint \
  prettier \
  eslint-config-prettier
log "Dépendances dev installées"

# ─── 3. Configuration TypeScript ──────────────────────────────
info "Configuration TypeScript..."
cat <<'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
log "tsconfig.json créé"

# ─── 4. Initialisation de Prisma ──────────────────────────────
info "Initialisation de Prisma..."
npx prisma init
log "Prisma initialisé"

# ─── 5. Arborescence MVC ──────────────────────────────────────
info "Création de l'arborescence MVC..."
mkdir -p \
  src/controllers \
  src/routes \
  src/middlewares \
  src/services \
  src/types \
  src/utils \
  src/config
log "Arborescence créée"

# ─── 6. Types TypeScript partagés ─────────────────────────────
info "Création des types TypeScript..."
cat <<'EOF' > src/types/index.ts
import { Request } from 'express';

// ─── Réponse API normalisée ─────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// ─── Pagination ─────────────────────────────────────────────
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ─── Request avec JWT ────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// ─── Ajoute tes types métier ici ────────────────────────────
EOF
log "Types créés"

# ─── 7. Helper de réponse API ─────────────────────────────────
cat <<'EOF' > src/utils/response.ts
import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Succès',
  status = 200
): void => {
  const body: ApiResponse<T> = { success: true, data, message };
  res.status(status).json(body);
};

export const sendError = (
  res: Response,
  message: string,
  status = 500,
  errors?: string[]
): void => {
  const body: ApiResponse = { success: false, message, errors };
  res.status(status).json(body);
};
EOF

# ─── 8. Logger simple ─────────────────────────────────────────
cat <<'EOF' > src/utils/logger.ts
const timestamp = () => new Date().toISOString();

export const logger = {
  info:  (msg: string) => console.log(`[${timestamp()}] INFO  ${msg}`),
  warn:  (msg: string) => console.warn(`[${timestamp()}] WARN  ${msg}`),
  error: (msg: string) => console.error(`[${timestamp()}] ERROR ${msg}`),
};
EOF

# ─── 9. Client Prisma (singleton) ─────────────────────────────
info "Création du client Prisma..."
cat <<'EOF' > src/config/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
EOF
log "Client Prisma créé"

# ─── 10. Middlewares ──────────────────────────────────────────
info "Création des middlewares..."

# Gestion centralisée des erreurs
cat <<'EOF' > src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.statusCode ?? 500;
  logger.error(`${status} — ${err.message}`);
  sendError(res, err.message || 'Erreur interne du serveur', status);
};
EOF

# Middleware 404
cat <<'EOF' > src/middlewares/notFound.ts
import { Request, Response } from 'express';
import { sendError } from '../utils/response';

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Route introuvable', 404);
};
EOF

# Validation Joi générique
cat <<'EOF' > src/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { sendError } from '../utils/response';

export const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((d) => d.message);
      sendError(res, 'Données invalides', 400, errors);
      return;
    }
    next();
  };
EOF
log "Middlewares créés"

# ─── 11. Contrôleur exemple ───────────────────────────────────
info "Création d'un contrôleur exemple..."
cat <<'EOF' > src/controllers/status.controller.ts
import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { prisma } from '../config/prisma';

export const getStatus = async (_req: Request, res: Response): Promise<void> => {
  // Vérifie la connexion à la base de données
  await prisma.$queryRaw`SELECT 1`;
  sendSuccess(res, {
    status: 'OK',
    database: 'connectée',
    timestamp: new Date().toISOString(),
  });
};
EOF
log "Contrôleur créé"

# ─── 12. Routes ───────────────────────────────────────────────
info "Création des routes..."
cat <<'EOF' > src/routes/status.routes.ts
import { Router } from 'express';
import { getStatus } from '../controllers/status.controller';

const router = Router();

router.get('/status', getStatus);

export default router;
EOF

cat <<'EOF' > src/routes/index.ts
import { Router } from 'express';
import statusRoutes from './status.routes';

const router = Router();

router.use('/', statusRoutes);
// Ajoute tes routes ici :
// router.use('/users', userRoutes);

export default router;
EOF
log "Routes créées"

# ─── 13. Point d'entrée principal ─────────────────────────────
info "Création de src/index.ts..."
cat <<'EOF' > src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globaux ───────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api', router);

app.get('/', (_req, res) => {
  res.json({ message: 'API opérationnelle', version: '1.0.0' });
});

// ─── Gestion des erreurs (toujours en dernier) ────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Démarrage ────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur http://localhost:${PORT}`);
  logger.info(`Environnement : ${process.env.NODE_ENV || 'development'}`);
});
EOF
log "index.ts créé"

# ─── 14. Configuration nodemon ────────────────────────────────
info "Configuration de nodemon..."
cat <<'EOF' > nodemon.json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node -r tsconfig-paths/register src/index.ts"
}
EOF
log "nodemon.json créé"

# ─── 15. Mise à jour de package.json (scripts) ────────────────
info "Mise à jour des scripts npm..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  dev:     'nodemon',
  build:   'tsc',
  start:   'node dist/index.js',
  lint:    'eslint src/**/*.ts',
  migrate: 'npx prisma migrate dev',
  studio:  'npx prisma studio',
  generate:'npx prisma generate',
  format:  'prettier --write src/**/*.ts'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"
log "Scripts npm mis à jour"

# ─── 16. Fichiers de config qualité ───────────────────────────
info "Configuration de Prettier..."
cat <<'EOF' > .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF

info "Mise à jour du .gitignore..."
cat <<'EOF' >> .gitignore
.env
.env.local
dist/
node_modules/
*.js.map
EOF

# ─── 17. Fichiers .env ────────────────────────────────────────
info "Création des fichiers d'environnement..."
cat <<'EOF' > .env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
# Remplace par tes vrais identifiants :
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nom_db?schema=public"
EOF

cat <<'EOF' > .env.example
# Copie ce fichier en .env et remplis les valeurs
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nom_db?schema=public"
EOF
log "Fichiers .env créés"

# ─── 18. README ───────────────────────────────────────────────
cat <<EOF > README.md
# $PROJECT_NAME

Backend Node.js + TypeScript + Express + Prisma.

## Démarrage rapide

\`\`\`bash
# 1. Configure la base de données
cp .env.example .env
# Édite DATABASE_URL dans .env

# 2. Applique le schéma Prisma
npm run migrate

# 3. Lance le serveur
npm run dev
\`\`\`

## Scripts disponibles

| Commande            | Description                          |
|---------------------|--------------------------------------|
| \`npm run dev\`       | Serveur de développement (nodemon)   |
| \`npm run build\`     | Compilation TypeScript               |
| \`npm run start\`     | Lance le build compilé               |
| \`npm run migrate\`   | Applique les migrations Prisma       |
| \`npm run studio\`    | Interface visuelle Prisma Studio     |
| \`npm run generate\`  | Régénère le client Prisma            |
| \`npm run format\`    | Formate le code avec Prettier        |

## Structure

\`\`\`
src/
├── config/         # Prisma client (singleton)
├── controllers/    # Logique des requêtes HTTP
├── middlewares/    # errorHandler, notFound, validate
├── routes/         # Définition des routes
├── services/       # Logique métier (à compléter)
├── types/          # Types TypeScript partagés
└── utils/          # logger, response helpers
\`\`\`

## Routes disponibles

| Méthode | Endpoint       | Description              |
|---------|----------------|--------------------------|
| GET     | /              | Santé de l'API           |
| GET     | /api/status    | Statut + connexion DB    |
EOF

# ─── Résumé final ──────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         BACKEND CONFIGURÉ AVEC SUCCÈS !      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
log "Projet : $PROJECT_NAME"
log "Node.js : $(node -v) | npm : $(npm -v)"
echo ""
info "Prochaines étapes :"
echo -e "  ${YELLOW}1.${NC} Configure ${YELLOW}DATABASE_URL${NC} dans ${YELLOW}.env${NC}"
echo -e "  ${YELLOW}2.${NC} Définis tes tables dans ${YELLOW}prisma/schema.prisma${NC}"
echo -e "  ${YELLOW}3.${NC} Lance ${YELLOW}npm run migrate${NC} pour créer les tables"
echo -e "  ${YELLOW}4.${NC} Lance ${YELLOW}npm run dev${NC} pour démarrer"
echo ""

