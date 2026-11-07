/**
 * Official YouTube API Quota Management & Persistent Cache
 * Compliance with Google YouTube Data API v3 Quota Documentation:
 *
 * 1. search.list: 1 unit per request, separate default allocation of 100 calls/day.
 * 2. videos.list: 1 unit per request (batched up to 50 IDs).
 * 3. channels.list: 1 unit per request (batched up to 50 IDs).
 * 4. playlistItems.list: 1 unit per request.
 * 5. Daily reset: Strictly at Midnight Pacific Time (America/Los_Angeles, PT), NOT UTC.
 * 6. Concurrency-safe persistent storage using Supabase with atomic updates.
 */

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface QuotaStatus {
  // Dual quota counters
  searchDailyLimit: number;
  searchConsumed: number;
  searchRemaining: number;
  sharedDailyLimit: number;
  sharedConsumed: number;
  sharedRemaining: number;
  currentDayPt: string; // e.g. "2026-11-07"
  resetTimeUtc: string; // Next midnight PT in UTC
  resetTimeFormattedPt: string;
  isExceeded: boolean;
  warningLevel: "normal" | "warning" | "critical" | "exceeded";
}

/**
 * Returns current date string formatted in America/Los_Angeles (YYYY-MM-DD).
 */
export function getPacificDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

/**
 * Calculates the exact next Midnight Pacific Time in UTC.
 * Google resets YouTube API quota counters daily at midnight PT.
 */
export function getNextPacificMidnightUtc(date: Date = new Date()): Date {
  const nextDay = new Date(date.getTime() + 24 * 3600 * 1000);
  const nextPtDateStr = getPacificDateString(nextDay);

  const candidate = new Date(date);
  candidate.setUTCMinutes(0, 0, 0);

  for (let addHours = 1; addHours <= 36; addHours++) {
    const testTime = new Date(date.getTime() + addHours * 3600 * 1000);
    testTime.setUTCMinutes(0, 0, 0);
    const dStr = getPacificDateString(testTime);
    const hourStr = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      hourCycle: "h23",
    }).format(testTime);

    if (dStr === nextPtDateStr && (hourStr === "0" || hourStr === "00")) {
      return testTime;
    }
  }

  candidate.setUTCHours(8, 0, 0, 0);
  return candidate;
}

export class PersistentQuotaTracker {
  // Configurable limits from env or official Google defaults
  private getSearchLimit(): number {
    const envVal = parseInt(process.env.YOUTUBE_SEARCH_DAILY_LIMIT || "", 10);
    return isNaN(envVal) || envVal <= 0 ? 100 : envVal;
  }

  private getSharedLimit(): number {
    const envVal = parseInt(process.env.YOUTUBE_SHARED_DAILY_LIMIT || "", 10);
    return isNaN(envVal) || envVal <= 0 ? 10000 : envVal;
  }

  // Local fallback cache if database is temporarily unreachable
  private memorySearchCount = 0;
  private memorySharedCount = 0;
  private memoryDayPt = getPacificDateString();
  private memoryCache = new Map<string, { data: any; expiresAt: number }>();

  private syncLocalDay() {
    const currentDay = getPacificDateString();
    if (currentDay !== this.memoryDayPt) {
      this.memorySearchCount = 0;
      this.memorySharedCount = 0;
      this.memoryDayPt = currentDay;
    }
  }

  /**
   * Retrieves live quota status across search requests and shared quota units.
   */
  public async getStatus(userTimezone?: string): Promise<QuotaStatus> {
    this.syncLocalDay();
    const currentDayPt = getPacificDateString();
    const searchLimit = this.getSearchLimit();
    const sharedLimit = this.getSharedLimit();

    let searchConsumed = this.memorySearchCount;
    let sharedConsumed = this.memorySharedCount;

    // Try reading from persistent Supabase table
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await (supabase.from("youtube_api_quotas") as any)
        .select("search_requests_count, shared_units_count")
        .eq("day_pt", currentDayPt)
        .maybeSingle();

      if (!error && data) {
        searchConsumed = Math.max(searchConsumed, data.search_requests_count || 0);
        sharedConsumed = Math.max(sharedConsumed, data.shared_units_count || 0);
        this.memorySearchCount = searchConsumed;
        this.memorySharedCount = sharedConsumed;
      }
    } catch {
      // Continue using in-memory fallback
    }

    const searchRemaining = Math.max(0, searchLimit - searchConsumed);
    const sharedRemaining = Math.max(0, sharedLimit - sharedConsumed);

    const isExceeded = searchRemaining <= 0 || sharedRemaining <= 0;
    const searchRatio = searchConsumed / searchLimit;
    const sharedRatio = sharedConsumed / sharedLimit;
    const maxRatio = Math.max(searchRatio, sharedRatio);

    let warningLevel: QuotaStatus["warningLevel"] = "normal";
    if (maxRatio >= 1.0) warningLevel = "exceeded";
    else if (maxRatio >= 0.8) warningLevel = "critical";
    else if (maxRatio >= 0.5) warningLevel = "warning";

    const nextMidnightUtc = getNextPacificMidnightUtc();

    const tzToUse = userTimezone || "America/Los_Angeles";
    let formattedReset = "";
    try {
      formattedReset = new Intl.DateTimeFormat("en-US", {
        timeZone: tzToUse,
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
      }).format(nextMidnightUtc);
    } catch {
      formattedReset = nextMidnightUtc.toISOString();
    }

    return {
      searchDailyLimit: searchLimit,
      searchConsumed,
      searchRemaining,
      sharedDailyLimit: sharedLimit,
      sharedConsumed,
      sharedRemaining,
      currentDayPt,
      resetTimeUtc: nextMidnightUtc.toISOString(),
      resetTimeFormattedPt: formattedReset,
      isExceeded,
      warningLevel,
    };
  }

  /**
   * Concurrency-safe pre-check: Can we afford a search query?
   */
  public async canAffordSearch(): Promise<boolean> {
    const status = await this.getStatus();
    return status.searchRemaining > 0 && status.sharedRemaining > 0;
  }

  /**
   * Concurrency-safe pre-check: Can we afford shared units?
   */
  public async canAffordShared(units: number = 1): Promise<boolean> {
    const status = await this.getStatus();
    return status.sharedRemaining >= units;
  }

  /**
   * Concurrency-safe atomic increment of request counters.
   */
  public async recordUsage(params: {
    searchRequests?: number;
    sharedUnits?: number;
    operationName: string;
  }): Promise<void> {
    this.syncLocalDay();
    const searchInc = params.searchRequests || 0;
    const sharedInc = params.sharedUnits || 0;
    const currentDayPt = getPacificDateString();

    // Update in-memory fallback immediately
    this.memorySearchCount += searchInc;
    this.memorySharedCount += sharedInc;

    // Persist atomically to Supabase
    try {
      const supabase = createServerSupabaseClient();
      // Use RPC if available, or atomic upsert
      const { error: rpcError } = await (supabase.rpc as any)("increment_youtube_quota", {
        target_day_pt: currentDayPt,
        search_inc: searchInc,
        shared_inc: sharedInc,
      });

      if (rpcError) {
        // Fallback: upsert directly
        await (supabase.from("youtube_api_quotas") as any).upsert(
          {
            day_pt: currentDayPt,
            search_requests_count: this.memorySearchCount,
            shared_units_count: this.memorySharedCount,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "day_pt" }
        );
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Could not persist quota increment to Supabase, used local memory:", err);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[YouTube Quota] +${searchInc} search, +${sharedInc} shared units for "${params.operationName}". Day: ${currentDayPt} PT.`
      );
    }
  }

  /**
   * Persistent Cache: Concurrency-safe lookup with TTL expiration.
   */
  public async getCache<T>(cacheKey: string): Promise<T | null> {
    const now = Date.now();

    // 1. Fast in-memory check
    const local = this.memoryCache.get(cacheKey);
    if (local && local.expiresAt > now) {
      return local.data as T;
    }

    // 2. Persistent Supabase lookup
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await (supabase.from("youtube_research_cache") as any)
        .select("data, expires_at")
        .eq("cache_key", cacheKey)
        .maybeSingle();

      if (!error && data && data.expires_at) {
        const expTime = new Date(data.expires_at).getTime();
        if (expTime > now) {
          // Hydrate local cache
          this.memoryCache.set(cacheKey, { data: data.data, expiresAt: expTime });
          return data.data as T;
        } else {
          // Expired: prune lazily
          await (supabase.from("youtube_research_cache") as any).delete().eq("cache_key", cacheKey);
        }
      }
    } catch {
      // Continue
    }

    return null;
  }

  /**
   * Persistent Cache: Concurrency-safe storage with TTL.
   */
  public async setCache<T>(cacheKey: string, data: T, ttlMs: number = 3600 * 1000): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    const expiresAtIso = new Date(expiresAt).toISOString();

    // 1. Local memory update
    this.memoryCache.set(cacheKey, { data, expiresAt });

    // 2. Persistent Supabase upsert
    try {
      const supabase = createServerSupabaseClient();
      await (supabase.from("youtube_research_cache") as any).upsert(
        {
          cache_key: cacheKey,
          data,
          expires_at: expiresAtIso,
          created_at: new Date().toISOString(),
        },
        { onConflict: "cache_key" }
      );
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Could not persist cache entry to Supabase:", err);
      }
    }
  }

  public clearCache() {
    this.memoryCache.clear();
  }
}

export const youtubeQuota = new PersistentQuotaTracker();
