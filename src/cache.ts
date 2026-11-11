export const CACHE_TTL_24H_MS = 24 * 60 * 60 * 1000;

export const EDGE_CACHE_HEADERS_24H = {
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
  'CDN-Cache-Control': 'max-age=86400',
};

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxEntries = 5000;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number = CACHE_TTL_24H_MS): void {
    if (this.store.size >= this.maxEntries) {
      const oldestKeys = Array.from(this.store.keys()).slice(0, 500);
      for (const k of oldestKeys) this.store.delete(k);
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const memoryCache = new MemoryCache();

export async function with24hCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  const fresh = await fetcher();
  if (fresh !== null && fresh !== undefined) {
    memoryCache.set(key, fresh, CACHE_TTL_24H_MS);
  }
  return fresh;
}
