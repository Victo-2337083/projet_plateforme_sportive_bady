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

