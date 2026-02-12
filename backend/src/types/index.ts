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

