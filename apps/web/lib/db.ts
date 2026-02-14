import { openDB } from 'idb';

export const appDbPromise = openDB('daily-learning', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('cache')) db.createObjectStore('cache');
  }
});

export async function setCache(key: string, value: unknown) {
  const db = await appDbPromise;
  await db.put('cache', value, key);
}
export async function getCache<T>(key: string) {
  const db = await appDbPromise;
  return (await db.get('cache', key)) as T | undefined;
}
