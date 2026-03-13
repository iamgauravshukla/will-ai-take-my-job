/**
 * Simple in-memory cache with TTL (time-to-live)
 * Useful for caching database queries and expensive computations
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface CacheStore {
  [key: string]: CacheEntry<unknown>;
}

const cacheStore: CacheStore = {};

export interface CacheConfig {
  ttlMs: number; // Time to live in milliseconds
}

const DEFAULT_TTL = 600000; // 10 minutes

/**
 * Get value from cache if it exists and hasn't expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cacheStore[key];

  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (entry.expiresAt < now) {
    delete cacheStore[key];
    return null;
  }

  return entry.value as T;
}

/**
 * Set value in cache with TTL
 */
export function setCached<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL): void {
  const now = Date.now();
  cacheStore[key] = {
    value,
    expiresAt: now + ttlMs,
  };
}

/**
 * Get or compute and cache value
 */
export async function getCachedOrCompute<T>(
  key: string,
  compute: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  const value = await compute();
  setCached(key, value, ttlMs);
  return value;
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  delete cacheStore[key];
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  Object.keys(cacheStore).forEach((key) => delete cacheStore[key]);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number;
  entries: string[];
} {
  const now = Date.now();
  const entries = Object.keys(cacheStore).filter((key) => cacheStore[key].expiresAt > now);

  return {
    size: entries.length,
    entries,
  };
}

/**
 * Cache keys enum for consistency
 */
export const CACHE_KEYS = {
  ALL_JOBS: 'jobs:all',
  JOB_BY_SLUG: (slug: string) => `job:${slug}`,
  ALL_SECTORS: 'sectors:all',
  SECTOR_JOBS: (sector: string) => `sector:${sector}`,
} as const;
