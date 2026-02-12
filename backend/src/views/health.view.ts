export const healthView = {
  ok: (extra: Record<string, unknown> = {}) => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ...extra,
  }),
};
