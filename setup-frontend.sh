#!/bin/bash
# =============================================================
# setup-frontend.sh — Scaffold React + TypeScript + Vite
# Usage: bash setup-frontend.sh [nom-du-projet]
# =============================================================

set -e  # Arrêter le script à la première erreur

# ─── Couleurs pour les messages ───────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()    { echo -e "${GREEN}[✔]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }
info()   { echo -e "${BLUE}[→]${NC} $1"; }

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
PROJECT_NAME="${1:-frontend}"

if [ -d "$PROJECT_NAME" ]; then
  error "Le dossier '$PROJECT_NAME' existe déjà. Choisis un autre nom ou supprime-le."
fi

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Création du projet : $PROJECT_NAME ${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# ─── 1. Création du projet Vite ───────────────────────────────
info "Création du projet Vite (React + TypeScript)..."
npm create vite@latest "$PROJECT_NAME" -- --template react-ts
cd "$PROJECT_NAME"
log "Projet Vite créé"

# ─── 2. Installation des dépendances ──────────────────────────
info "Installation des dépendances principales..."
npm install react-router-dom axios lucide-react
log "Dépendances installées"

info "Installation des dépendances de développement..."
npm install -D \
  eslint \
  @eslint/js \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  prettier \
  eslint-config-prettier \
  @types/node
log "Dépendances dev installées"

# ─── 3. Arborescence des dossiers ─────────────────────────────
info "Création de l'arborescence..."
mkdir -p \
  src/api \
  src/components/common \
  src/components/layout \
  src/hooks \
  src/pages \
  src/store \
  src/types \
  src/utils \
  src/styles
log "Arborescence créée"

# ─── 4. Fichier de types TypeScript ───────────────────────────
info "Création des types TypeScript..."
cat <<'EOF' > src/types/index.ts
// ─── Types de base ──────────────────────────────────────────────
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
}

// ─── Réponses API génériques ────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ─── Ajoute tes interfaces métier ici ──────────────────────────
EOF
log "Types créés"

# ─── 5. Configuration Axios avec intercepteurs ────────────────
info "Configuration d'Axios..."
cat <<'EOF' > src/api/axios.ts
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur requête : ajoute le token JWT si présent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur réponse : gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
EOF
log "Axios configuré"

# ─── 6. Hook useApi générique ─────────────────────────────────
info "Création du hook useApi..."
cat <<'EOF' > src/hooks/useApi.ts
import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<{ data: T }>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await promise;
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  return { ...state, execute };
}
EOF
log "Hook useApi créé"

# ─── 7. Layout principal ──────────────────────────────────────
info "Création du layout..."
cat <<'EOF' > src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="layout">
      <header className="layout__header">
        <nav>Mon Application</nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
      <footer className="layout__footer">
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
EOF
log "Layout créé"

# ─── 8. Pages ─────────────────────────────────────────────────
info "Création des pages..."
cat <<'EOF' > src/pages/Home.tsx
const Home = () => {
  return (
    <div>
      <h1>Bienvenue</h1>
      <p>Interface connectée au backend.</p>
    </div>
  );
};

export default Home;
EOF

cat <<'EOF' > src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <h1>404 — Page introuvable</h1>
    <Link to="/">Retour à l'accueil</Link>
  </div>
);

export default NotFound;
EOF
log "Pages créées"

# ─── 9. App.tsx avec routes et layout ─────────────────────────
info "Mise à jour de App.tsx..."
cat <<'EOF' > src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Ajoute tes routes ici */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
EOF
log "App.tsx mis à jour"

# ─── 10. Utilitaire formatDate ────────────────────────────────
cat <<'EOF' > src/utils/formatDate.ts
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date(date));
};
EOF

# ─── 11. Fichiers de config ───────────────────────────────────
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

info "Configuration de .gitignore..."
cat <<'EOF' >> .gitignore
.env
.env.local
.env.*.local
dist/
EOF

# ─── 12. Fichiers .env ────────────────────────────────────────
info "Création des fichiers d'environnement..."
cat <<'EOF' > .env
VITE_API_URL=http://localhost:3000
EOF

cat <<'EOF' > .env.example
# Copie ce fichier en .env et remplis les valeurs
VITE_API_URL=http://localhost:3000
EOF
log "Fichiers .env créés"

# ─── 13. README ───────────────────────────────────────────────
cat <<EOF > README.md
# $PROJECT_NAME

Projet React + TypeScript généré avec Vite.

## Démarrage rapide

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts disponibles

| Commande         | Description                    |
|------------------|-------------------------------|
| \`npm run dev\`    | Lance le serveur de développement |
| \`npm run build\`  | Build de production            |
| \`npm run preview\`| Prévisualise le build          |
| \`npm run lint\`   | Vérifie le code                |

## Structure

\`\`\`
src/
├── api/          # Configuration Axios
├── components/   # Composants réutilisables
├── hooks/        # Hooks personnalisés
├── pages/        # Pages de l'application
├── store/        # État global (à compléter)
├── types/        # Types TypeScript
└── utils/        # Fonctions utilitaires
\`\`\`
EOF

# ─── Résumé final ──────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         FRONTEND CONFIGURÉ AVEC SUCCÈS !     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
log "Projet : $PROJECT_NAME"
log "Node.js : $(node -v) | npm : $(npm -v)"
echo ""
info "Pour démarrer :"
echo -e "  ${YELLOW}cd $PROJECT_NAME${NC}"
echo -e "  ${YELLOW}npm run dev${NC}"
echo ""

