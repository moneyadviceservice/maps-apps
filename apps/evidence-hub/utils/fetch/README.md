# Research library document cache

How the research library list loads documents. Document **pages** (`fetchDocument` / `get-document-{lang}`) do not use this cache.

Entry: `pages/[language]/research-library/index.tsx` → `fetchDocumentsPaginated` in `documents.ts`.

## Request flow

Research library SSR → `fetchDocumentsPaginated` → `ensureSlimCaches`:

1. Compare Redis `evidence-hub:build-id` to this process’s build id. On change, clear process memory and store the new id.
2. If process memory already has slim docs **and** search index for this build id → skip to step 6.
3. Else if Redis `docs-slim` **and** `search-index` both exist → decompress, hydrate memory → step 6.
4. Else call AEM `get-documents-en` (retry up to 3 times). Build slim docs + search index.
5. Compress and write both Redis keys (TTL 1h) and process memory.
6. Filter and sort in memory, then paginate.

Same Node process: concurrent SSR shares one in-flight `ensureSlimCaches` promise.

## What is stored

**Slim docs** — every list item with `sections: []`. Metadata (title, slug, tags, dates, overview) stays; section JSON is dropped so the list payload stays small.

**Search index** — `Map<slug, { titleText, overviewText, sectionsText, combinedText }>`. Plain text is extracted once when slim docs and the search index are built from the AEM response (including section JSON). Keyword match and relevance sort use this map, not the slim docs.

AEM fill: persisted query `evidence-hub/get-documents-en` (up to 3 attempts with backoff). Empty array if AEM throws. Redis values are compressed JSON.

## Redis keys

TTL is **3600s** on every write. Client is `REDIS_API_URL` / `REDIS_API_KEY`.

| Key | Value |
| --- | --- |
| `evidence-hub:build-id` | Current build id |
| `evidence-hub:docs-slim:{buildId}` | Slim document array |
| `evidence-hub:search-index:{buildId}` | Search-index object (JSON object, hydrated to a `Map`) |

`buildId` is `AEM_CACHE` (`e2e-mock` when `CI=true`).

On build-id change, process memory is cleared and the new id is written to Redis. `docs-slim` and `search-index` keys for the old id are left to expire.

## `CI=true` (`isMockAem`)

List query reads `fixtures/e2e/`. Memory is still used. Redis is not read or written. Homepage and tags still call live AEM.

## After slim docs and search index are in memory

`getFilteredDocuments` applies tag/date filters, then keyword match via `getMatchingSlugs`, then sort (relevance / last updated / publish year). Pagination is last. A page past `totalPages` falls back to page 1.

## Files

| File | Role |
| --- | --- |
| `documents.ts` | Filter, sort, paginate |
| `documentsCache.ts` | Memory, Redis, AEM fill |
| `documentsModuleCache.ts` | Per-process slim + search + in-flight promise |
| `documentsCacheTypes.ts` | `SlimDocument`, `SearchTextBySlug` |
| `aemHeadlessClient.ts` | Query name, `isMockAem`, fixtures |

## Logs

`EVIDENCE_HUB_CACHE_LOG=true` logs build reuse and item / unique-slug counts on AEM fill and Redis hydrate. Duplicate slugs also `console.warn`.
