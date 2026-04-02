/**
 * Cache Service
 * Управляет кэшированием данных с TTL
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // milliseconds
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>()
  private timers = new Map<string, ReturnType<typeof setTimeout>>()

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!)
    }

    const ttlMs = ttlSeconds * 1000
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })

    // Auto-expire after TTL
    const timer = setTimeout(() => {
      this.cache.delete(key)
      this.timers.delete(key)
    }, ttlMs)

    this.timers.set(key, timer)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      this.timers.forEach((timer) => clearTimeout(timer))
      this.timers.clear()
      return
    }

    const regex = new RegExp(pattern)
    Array.from(this.cache.keys()).forEach((key) => {
      if (regex.test(key)) {
        this.cache.delete(key)
        if (this.timers.has(key)) {
          clearTimeout(this.timers.get(key)!)
          this.timers.delete(key)
        }
      }
    })
  }

  size(): number {
    return this.cache.size
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }
}

export const cacheService = new CacheService()
