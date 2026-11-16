import { DocumentTemplate } from 'types/@adobe/page';

import {
  redisRestDel,
  redisRestGet,
  redisRestSet,
} from '@maps-react/redis/rest-client';
import { compress, isCompressed, uncompress } from '@maps-react/utils/compress';

import {
  aemHeadlessClient,
  DOCUMENTS_QUERY_NAME,
  isMockAem,
  MOCK_AEM_CACHE_BUILD_ID,
} from '../aem/aemHeadlessClient';
import { extractTextFromRichText } from '../richText/extractTextFromRichText';
import {
  type DocSearchEntry,
  normalizeForSearch,
} from '../search/keywordSearch';
import * as documentsModuleCache from './documentsModuleCache';
import type { SearchTextBySlug, SlimDocument } from './documentsCacheTypes';
import { withRetry } from './withRetry';

export type { SearchTextBySlug, SlimDocument } from './documentsCacheTypes';

const CACHE_CONFIG = {
  BUILD_ID_KEY: 'evidence-hub:build-id',
  DOCS_SLIM_PREFIX: 'evidence-hub:docs-slim',
  SEARCH_INDEX_PREFIX: 'evidence-hub:search-index',
  TTL_SECONDS: 3600,
} as const;

function cacheLog(...args: unknown[]): void {
  if (process.env.EVIDENCE_HUB_CACHE_LOG === 'true') {
    console.log(...args);
  }
}

function getDocsSlimCacheKey(buildId: string): string {
  return `${CACHE_CONFIG.DOCS_SLIM_PREFIX}:${buildId}`;
}

function getSearchIndexCacheKey(buildId: string): string {
  return `${CACHE_CONFIG.SEARCH_INDEX_PREFIX}:${buildId}`;
}

export function getBuildId(): string {
  if (isMockAem()) {
    return MOCK_AEM_CACHE_BUILD_ID;
  }

  return process.env.AEM_CACHE as string;
}

function hasSlimModuleCache(buildId: string): boolean {
  if (
    documentsModuleCache.slimModuleCache.buildId !== buildId ||
    documentsModuleCache.slimModuleCache.docsSlim == null ||
    documentsModuleCache.slimModuleCache.searchBySlug == null
  ) {
    return false;
  }

  const docsSlim = documentsModuleCache.slimModuleCache
    .docsSlim as SlimDocument[];
  const searchBySlug = documentsModuleCache.slimModuleCache
    .searchBySlug as SearchTextBySlug;

  if (docsSlim.some((d) => d.slug) && searchBySlug.size === 0) {
    return false;
  }

  return true;
}

function readSlimModuleCache(): {
  docsSlim: SlimDocument[];
  searchBySlug: SearchTextBySlug;
} {
  return {
    docsSlim: documentsModuleCache.slimModuleCache.docsSlim as SlimDocument[],
    searchBySlug: documentsModuleCache.slimModuleCache
      .searchBySlug as SearchTextBySlug,
  };
}

function writeSlimModuleCache(
  buildId: string,
  docsSlim: SlimDocument[],
  searchBySlug: SearchTextBySlug,
): void {
  documentsModuleCache.slimModuleCache.buildId = buildId;
  documentsModuleCache.slimModuleCache.docsSlim = docsSlim;
  documentsModuleCache.slimModuleCache.searchBySlug = searchBySlug;
}

async function readDecompressedCacheValue(
  cacheKey: string,
  label: string,
): Promise<string | null> {
  const cachedResponse = await redisRestGet(cacheKey);
  const cached = cachedResponse.success ? cachedResponse.data?.value : null;
  if (!cached) return null;

  if (!isCompressed(cached)) {
    return cached;
  }

  try {
    return await uncompress(cached);
  } catch (decompressError) {
    console.warn(
      `Failed to decompress ${label} for key ${cacheKey}, trying as plain JSON:`,
      decompressError,
    );
    return cached;
  }
}

function isDocSearchEntry(value: unknown): value is DocSearchEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as DocSearchEntry).titleText === 'string' &&
    typeof (value as DocSearchEntry).overviewText === 'string' &&
    typeof (value as DocSearchEntry).sectionsText === 'string' &&
    typeof (value as DocSearchEntry).combinedText === 'string'
  );
}

function parseSearchIndexRecord(parsed: unknown): SearchTextBySlug | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }

  const map: SearchTextBySlug = new Map();
  for (const [slug, entry] of Object.entries(parsed)) {
    if (isDocSearchEntry(entry)) {
      map.set(slug, entry);
    }
  }

  return map.size > 0 ? map : null;
}

async function getCachedSearchIndex(
  cacheKey: string,
): Promise<SearchTextBySlug | null> {
  try {
    const decompressed = await readDecompressedCacheValue(
      cacheKey,
      'search-index',
    );
    if (!decompressed) return null;
    return parseSearchIndexRecord(JSON.parse(decompressed));
  } catch (error) {
    console.error(`Cache read error for search-index key ${cacheKey}:`, error);
  }
  return null;
}

async function cacheSearchIndex(
  cacheKey: string,
  searchBySlug: SearchTextBySlug,
): Promise<void> {
  try {
    const compressed = await compress(
      JSON.stringify(Object.fromEntries(searchBySlug)),
    );
    await redisRestSet(cacheKey, compressed, {
      ttlSeconds: CACHE_CONFIG.TTL_SECONDS,
    });
  } catch (error) {
    console.error(`Cache write error for search-index key ${cacheKey}:`, error);
  }
}

async function getCachedDocsSlim(
  cacheKey: string,
): Promise<SlimDocument[] | null> {
  try {
    const decompressed = await readDecompressedCacheValue(
      cacheKey,
      'docs-slim',
    );
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    if (
      Array.isArray(parsed) &&
      parsed.every((d) => d && typeof d.slug === 'string')
    ) {
      return parsed as SlimDocument[];
    }
  } catch (error) {
    console.error(`Cache read error for docs-slim key ${cacheKey}:`, error);
  }
  return null;
}

async function cacheDocsSlim(
  cacheKey: string,
  docs: SlimDocument[],
): Promise<void> {
  try {
    const compressed = await compress(JSON.stringify(docs));
    await redisRestSet(cacheKey, compressed, {
      ttlSeconds: CACHE_CONFIG.TTL_SECONDS,
    });
  } catch (error) {
    console.error(`Cache write error for docs-slim key ${cacheKey}:`, error);
  }
}

async function fetchAllDocumentsFromAEM(): Promise<DocumentTemplate[]> {
  const response = await withRetry(async () => {
    const { data } = await aemHeadlessClient.runPersistedQuery(
      DOCUMENTS_QUERY_NAME,
    );
    return data?.pageSectionTemplateList?.items || [];
  });

  return Array.isArray(response) ? response : [];
}

async function fetchAllDocumentsFromAEMOrEmpty(): Promise<DocumentTemplate[]> {
  try {
    return await fetchAllDocumentsFromAEM();
  } catch (error) {
    console.error('Failed to fetch documents from AEM:', error);
    return [];
  }
}

function logDuplicateDocumentSlugs(
  source: string,
  documents: Array<{ slug?: string; title?: string }>,
): void {
  const titlesBySlug = new Map<string, string[]>();
  for (const doc of documents) {
    if (!doc.slug) continue;
    const titles = titlesBySlug.get(doc.slug) ?? [];
    titles.push(doc.title ?? '');
    titlesBySlug.set(doc.slug, titles);
  }

  const duplicates = [...titlesBySlug.entries()]
    .filter(([, titles]) => titles.length > 1)
    .map(([slug, titles]) => ({ slug, count: titles.length, titles }));

  cacheLog(
    `Evidence Hub ${source}: ${documents.length} items, ${titlesBySlug.size} unique slugs`,
  );

  if (duplicates.length > 0) {
    console.warn(
      `Evidence Hub: duplicate document slugs in ${source}`,
      duplicates,
    );
  }
}

function buildSlimDocuments(documents: DocumentTemplate[]): SlimDocument[] {
  return documents
    .filter((d): d is DocumentTemplate => Boolean(d?.slug))
    .map((d) => ({
      ...d,
      sections: [],
    }));
}

function buildDocSearchEntry(doc: DocumentTemplate): DocSearchEntry {
  const titleText = normalizeForSearch(doc.title ?? '');
  const overviewText = normalizeForSearch(
    extractTextFromRichText(doc.overview),
  );
  const sectionsText = normalizeForSearch(
    Array.isArray(doc.sections)
      ? doc.sections.map((s) => extractTextFromRichText(s)).join(' ')
      : '',
  );
  const combinedText = normalizeForSearch(
    [titleText, overviewText, sectionsText].filter(Boolean).join(' '),
  );
  return { titleText, overviewText, sectionsText, combinedText };
}

function buildSlimCachesFromDocuments(documents: DocumentTemplate[]): {
  docsSlim: SlimDocument[];
  searchBySlug: SearchTextBySlug;
} {
  logDuplicateDocumentSlugs('AEM get-documents-en', documents);
  const docsSlim = buildSlimDocuments(documents);
  const searchBySlug: SearchTextBySlug = new Map();
  for (const doc of documents) {
    if (!doc?.slug) continue;
    searchBySlug.set(doc.slug, buildDocSearchEntry(doc));
  }
  return { docsSlim, searchBySlug };
}

async function fetchAndPersistSlimCachesFromAEM(buildId: string): Promise<{
  buildId: string;
  docsSlim: SlimDocument[];
  searchBySlug: SearchTextBySlug;
}> {
  const documents = await fetchAllDocumentsFromAEMOrEmpty();
  const { docsSlim, searchBySlug } = buildSlimCachesFromDocuments(documents);

  await cacheDocsSlim(getDocsSlimCacheKey(buildId), docsSlim);
  await cacheSearchIndex(getSearchIndexCacheKey(buildId), searchBySlug);
  writeSlimModuleCache(buildId, docsSlim, searchBySlug);

  return { buildId, docsSlim, searchBySlug };
}

async function tryLoadSlimCachesFromRedis(
  buildId: string,
  cachedSlim: SlimDocument[],
): Promise<{
  buildId: string;
  docsSlim: SlimDocument[];
  searchBySlug: SearchTextBySlug;
} | null> {
  const slugs = cachedSlim.map((d) => d.slug).filter(Boolean);
  const searchBySlug = await getCachedSearchIndex(
    getSearchIndexCacheKey(buildId),
  );

  if (!searchBySlug || (slugs.length > 0 && searchBySlug.size === 0)) {
    cacheLog(
      'Slim docs cached but search index missing — fetching all documents from AEM',
    );
    return null;
  }

  writeSlimModuleCache(buildId, cachedSlim, searchBySlug);
  logDuplicateDocumentSlugs('Redis docs-slim', cachedSlim);
  return { buildId, docsSlim: cachedSlim, searchBySlug };
}

async function checkAndClearCacheOnNewBuild(): Promise<void> {
  if (isMockAem()) {
    return;
  }

  try {
    const currentBuildId = getBuildId();
    const cachedBuildIdResponse = await redisRestGet(CACHE_CONFIG.BUILD_ID_KEY);
    const cachedBuildId = cachedBuildIdResponse.success
      ? cachedBuildIdResponse.data?.value
      : null;

    if (cachedBuildId === currentBuildId) {
      cacheLog(`Reusing cache for build: ${currentBuildId}`);
      return;
    }

    cacheLog(
      `New build detected (${currentBuildId}). Previous: ${cachedBuildId}. Clearing process cache...`,
    );

    documentsModuleCache.clearSlimModuleCache();

    await redisRestSet(CACHE_CONFIG.BUILD_ID_KEY, currentBuildId, {
      ttlSeconds: CACHE_CONFIG.TTL_SECONDS,
    });

    cacheLog('Evidence-hub process cache cleared and new build ID stored');
  } catch (error) {
    console.error('Error checking build ID:', error);
  }
}

export async function clearEvidenceHubCache(): Promise<void> {
  documentsModuleCache.clearSlimModuleCache();

  try {
    await redisRestDel(CACHE_CONFIG.BUILD_ID_KEY);
  } catch (error) {
    console.error('Failed to clear evidence hub cache:', error);
  }
}

async function ensureSlimCachesInner(): Promise<{
  buildId: string;
  docsSlim: SlimDocument[];
  searchBySlug: SearchTextBySlug;
}> {
  const buildId = getBuildId();

  if (isMockAem()) {
    if (hasSlimModuleCache(buildId)) {
      const cached = readSlimModuleCache();
      if (cached.docsSlim.length > 0) {
        return { buildId, ...cached };
      }
      documentsModuleCache.clearSlimModuleCache();
    }

    const documents = await fetchAllDocumentsFromAEMOrEmpty();
    const { docsSlim, searchBySlug } = buildSlimCachesFromDocuments(documents);
    writeSlimModuleCache(buildId, docsSlim, searchBySlug);
    return { buildId, docsSlim, searchBySlug };
  }

  if (hasSlimModuleCache(buildId)) {
    return { buildId, ...readSlimModuleCache() };
  }

  const cachedSlim = await getCachedDocsSlim(getDocsSlimCacheKey(buildId));
  if (cachedSlim) {
    const fromRedis = await tryLoadSlimCachesFromRedis(buildId, cachedSlim);
    if (fromRedis) {
      return fromRedis;
    }
  }

  return fetchAndPersistSlimCachesFromAEM(buildId);
}

export async function ensureSlimCaches(): Promise<{
  buildId: string;
  docsSlim: SlimDocument[];
  searchBySlug: SearchTextBySlug;
}> {
  await checkAndClearCacheOnNewBuild();

  const buildId = getBuildId();
  if (hasSlimModuleCache(buildId)) {
    return { buildId, ...readSlimModuleCache() };
  }

  documentsModuleCache.slimModuleCache.ensureInFlight ??=
    ensureSlimCachesInner().finally(() => {
      documentsModuleCache.slimModuleCache.ensureInFlight = null;
    });

  return documentsModuleCache.slimModuleCache.ensureInFlight as ReturnType<
    typeof ensureSlimCachesInner
  >;
}
