# Redis implementation – proof for acceptance criteria

This document maps each Redis-related AC to the code that implements it.

---

## 1. Firms list and epoch are cached in Redis with 1-hour TTL

**Evidence:**

- **`lib/cache/cacheConfig.ts`** – TTL and keys:
  - `HOURLY_CACHE_TTL: 3600` (1 hour in seconds)
  - `ALL_FIRMS_KEY: 'travel-directory:all-firms'` – cached firms list
  - `DISPLAY_ORDER_EPOCH_KEY: 'travel-directory:display-order-epoch'` – epoch

```15:16:apps/travel-insurance-directory/lib/cache/cacheConfig.ts
  /** TTL for cache keys: 1 hour. Aligns with hourly refresh; Redis eviction is a safety net if refresh stops. */
  HOURLY_CACHE_TTL: 3600,
```

- **`lib/firms/refreshFirmsCache.ts`** – both keys written with TTL:
  - Epoch: `setDisplayOrderEpoch(currentSeed)` → uses `ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL` (see `displayOrderEpoch.ts`)
  - Firms: `redisRestSet(CACHE_CONFIG.ALL_FIRMS_KEY, compressed, { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL })`

```53:56:apps/travel-insurance-directory/lib/firms/refreshFirmsCache.ts
    const setResponse = await redisRestSet(
      CACHE_CONFIG.ALL_FIRMS_KEY,
      emptyCompressed,
      { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL },
```

```77:80:apps/travel-insurance-directory/lib/firms/refreshFirmsCache.ts
  const setFirmsResponse = await redisRestSet(
    CACHE_CONFIG.ALL_FIRMS_KEY,
    compressed,
    { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL },
```

- **`lib/firms/displayOrderEpoch.ts`** – epoch key set with TTL:

```32:35:apps/travel-insurance-directory/lib/firms/displayOrderEpoch.ts
  const response = await redisRestSet(
    CACHE_CONFIG.DISPLAY_ORDER_EPOCH_KEY,
    String(seedHour),
    { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL },
```

**Tests:** `lib/cache/cacheConfig.test.ts` asserts `HOURLY_CACHE_TTL === 3600` and key names; `displayOrderEpoch.test.ts` asserts `redisRestSet` is called with `ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL`.

---

## 2. No Cosmos writes for display order

**Implematation:**

- **`lib/firms/displayOrderEpoch.ts`** – JSDoc states epoch is stored in Redis only:

```1:4:apps/travel-insurance-directory/lib/firms/displayOrderEpoch.ts
/**
 * Tracks when display_order was last updated so we can refresh when the
 * time-based seed changes (e.g. new hour). Stored in Redis only (no Cosmos writes).
 */
```

- **`lib/firms/refreshFirmsCache.ts`** – JSDoc and implementation:
  - “No Cosmos writes. Used by hourly cron and by read path when epoch is expired.”
  - Reads from Cosmos (`container.items.query(...)`), computes order in memory, writes only to Redis via `redisRestSet` and `setDisplayOrderEpoch`. No `container.items.upsert` or other Cosmos write.

```1:4:apps/travel-insurance-directory/lib/firms/refreshFirmsCache.ts
/**
 * Refresh firms cache in Redis: check Redis for hour passed, then call Cosmos and set order in Redis.
 * No Cosmos writes. Used by hourly cron and by read path when epoch is expired.
 */
```

- **`scripts/updateDisplayOrder.ts`** – “No Cosmos writes”; only calls `refreshFirmsCacheIfNeeded()`.

Display order is computed in memory and stored in Redis; Cosmos is read-only for this flow.

---

## 3. Listings use Redis when available and fall back to Cosmos when not

**Evidence:**

- **`lib/firms/getFirmsPaginated.ts`** – try Redis first, then Cosmos:

```106:126:apps/travel-insurance-directory/lib/firms/getFirmsPaginated.ts
export async function getFirmsPaginated(
  queryParams: QueryParams,
  page: number,
  limit: number,
): Promise<GetFirmsPaginatedResult> {
  try {
    const fromRedis = await getFirmsPaginatedFromRedis(
      queryParams,
      page,
      limit,
    );
    if (fromRedis != null) {
      return fromRedis;
    }
  } catch (err) {
    console.warn('Redis path failed, falling back to Cosmos:', err);
  }

  return getFirmsPaginatedFromCosmos(queryParams, page, limit);
}
```

- **`getFirmsPaginatedFromRedis`** returns `null` when Redis get fails or returns no data (after retry via `refreshFirmsCacheIfNeeded`); that triggers fallback.
- **Tests:** `getFirmsPaginated.test.ts` – “prefers Redis”, “falls back to Cosmos when Redis returns null”, “falls back to Cosmos when Redis get fails”.

---

## 4. Hourly refresh (cron/script) updates Redis only

**Evidence:**

- **`scripts/updateDisplayOrder.ts`** – entry point for hourly refresh:

```1:15:apps/travel-insurance-directory/scripts/updateDisplayOrder.ts
/**
 * Refreshes the firms cache in Redis: checks Redis for hour passed, then calls Cosmos
 * to fetch active firms, computes display order in memory, and writes ordered firms + epoch to Redis.
 * No Cosmos writes. Can be run as a script or triggered by the hourly cron / read path.
 */

import { refreshFirmsCacheIfNeeded } from '../lib/firms/refreshFirmsCache';

async function main(): Promise<void> {
  const result = await refreshFirmsCacheIfNeeded();
  console.log(
    result.refreshed
      ? `Refreshed Redis: ${result.firmsCount} firms`
      : 'Redis already up to date for current hour',
  );
```

- **`refreshFirmsCacheIfNeeded()`** (in `refreshFirmsCache.ts`): reads from Cosmos, shuffles in memory, writes only to Redis (all-firms key + epoch). No Cosmos writes.
- Scheduling: script is intended to be run on a schedule (e.g. Netlify scheduled function or external cron); the same logic also runs on the read path via `ensureFirmsCacheUpdated()` when the epoch has changed.

---

## 5. All-firms payload is compressed in Redis and decompressed when read

**Evidence:**

- **Write (compress)** – `lib/firms/refreshFirmsCache.ts`:

```74:76:apps/travel-insurance-directory/lib/firms/refreshFirmsCache.ts
  const jsonString = JSON.stringify(orderedFirms);
  const compressed = await compress(jsonString);
  const setFirmsResponse = await redisRestSet(
```

- **Read (decompress)** – `lib/firms/getFirmsPaginated.ts`:

```44:56:apps/travel-insurance-directory/lib/firms/getFirmsPaginated.ts
  let allFirms: TravelInsuranceFirmDocument[];
  try {
    const raw = response.data.value;
    let jsonString: string;
    if (isCompressed(raw)) {
      jsonString = await uncompress(raw);
    } else {
      jsonString = raw;
    }
    const parsed = JSON.parse(jsonString);
    allFirms = Array.isArray(parsed) ? parsed : [];
  } catch {
```

- **Shared compress:** `compress` / `uncompress` / `isCompressed` from `@maps-react/utils/compress` (e.g. `libs/shared/utils/src/compress`).
- Empty list is also stored compressed: `await compress(JSON.stringify([]))` in `refreshFirmsCache.ts`.

---

## Summary table

| AC | Location |
|----|----------|
| 1-hour TTL for firms + epoch | `cacheConfig.ts` (3600), `refreshFirmsCache.ts`, `displayOrderEpoch.ts` |
| No Cosmos writes for display order | `displayOrderEpoch.ts`, `refreshFirmsCache.ts`, `updateDisplayOrder.ts` |
| Redis first, Cosmos fallback | `getFirmsPaginated.ts` |
| Hourly refresh updates Redis only | `updateDisplayOrder.ts` → `refreshFirmsCacheIfNeeded()` |
| Compress on write, decompress on read | `refreshFirmsCache.ts` (compress), `getFirmsPaginated.ts` (uncompress) |
