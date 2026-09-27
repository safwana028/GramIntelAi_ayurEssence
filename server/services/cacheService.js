import { CONFIG } from "../config/config.js";

/**
 * Modular Cache Service
 * Supports TTL caching for read-heavy static endpoints (questionnaires, methodology)
 * Designed for easy drop-in replacement with Redis for multi-instance deployments.
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.enabled = CONFIG.CACHE_ENABLED;
  }

  get(key) {
    if (!this.enabled) return null;
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    if (!this.enabled) return;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }

  invalidate(patternOrKey) {
    if (patternOrKey.endsWith("*")) {
      const prefix = patternOrKey.slice(0, -1);
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.delete(patternOrKey);
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
