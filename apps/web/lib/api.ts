const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchWithOffline<T>(path: string, cacheKey: string): Promise<T | null> {
  const { getCache, setCache } = await import('./db');
  try {
    const res = await fetch(`${API}${path}`, { cache: 'no-store' });
    const json = (await res.json()) as T;
    await setCache(cacheKey, json);
    return json;
  } catch {
    return (await getCache<T>(cacheKey)) ?? null;
  }
}
