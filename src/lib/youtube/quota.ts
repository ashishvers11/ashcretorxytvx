/**
 * YouTube API Quota Management & Research Cache
 * Official Google YouTube API Quota Costing:
 * - search.list: 100 quota units
 * - videos.list: 1 unit per request (up to 50 video IDs batched)
 * - channels.list: 1 unit per request (up to 50 channel IDs batched)
 * - playlistItems.list: 1 unit per request (up to 50 items batched)
 * Default YouTube Data API v3 daily limit: 10,000 units / day
 */

export interface QuotaStatus {
  dailyLimit: number;
  consumedUnits: number;
  remainingUnits: number;
  resetTimeUtc: string;
  isExceeded: boolean;
  warningLevel: "normal" | "warning" | "critical" | "exceeded";
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

// In-memory daily quota tracker
class QuotaTracker {
  private dailyLimit = 10000;
  private consumedUnits = 0;
  private lastResetDay: string = new Date().toISOString().split("T")[0];
  private cache = new Map<string, CacheEntry<any>>();

  private checkDayReset() {
    const currentDay = new Date().toISOString().split("T")[0];
    if (currentDay !== this.lastResetDay) {
      this.consumedUnits = 0;
      this.lastResetDay = currentDay;
    }
  }

  public getStatus(): QuotaStatus {
    this.checkDayReset();
    const remaining = Math.max(0, this.dailyLimit - this.consumedUnits);
    const ratio = this.consumedUnits / this.dailyLimit;

    let warningLevel: QuotaStatus["warningLevel"] = "normal";
    if (ratio >= 1.0) warningLevel = "exceeded";
    else if (ratio >= 0.8) warningLevel = "critical";
    else if (ratio >= 0.5) warningLevel = "warning";

    // Next midnight UTC
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);

    return {
      dailyLimit: this.dailyLimit,
      consumedUnits: this.consumedUnits,
      remainingUnits: remaining,
      resetTimeUtc: tomorrow.toISOString(),
      isExceeded: remaining <= 0,
      warningLevel,
    };
  }

  public canAfford(estimatedCost: number): boolean {
    this.checkDayReset();
    return this.consumedUnits + estimatedCost <= this.dailyLimit;
  }

  public recordUsage(cost: number, operationName: string) {
    this.checkDayReset();
    this.consumedUnits += cost;
    if (process.env.NODE_ENV !== "production") {
      console.log(`[YouTube API Quota] Consumed ${cost} units for "${operationName}". Total: ${this.consumedUnits}/${this.dailyLimit}`);
    }
  }

  public getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public setCache<T>(key: string, data: T, ttlMs: number = 3600 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  public clearCache() {
    this.cache.clear();
  }
}

export const youtubeQuota = new QuotaTracker();
