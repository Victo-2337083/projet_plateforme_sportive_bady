# Security
- JWT auth with RBAC roles: child/parent/teacher/admin.
- OpenAI API key stays server-side; no client-side OpenAI calls.
- Admin-only AI endpoints protected by role guard.
- Rate limiting, retries and request timeout around AI calls.
