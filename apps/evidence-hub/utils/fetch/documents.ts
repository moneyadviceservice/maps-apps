import { DocumentTemplate } from 'types/@adobe/page';

import {
  redisRestDel,
  redisRestGet,
  redisRestSet,
} from '@maps-react/redis/rest-client';
import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';
import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import {
  DateRange,
  DateRangeOption,
  getDateRange,
} from '../filter/dateRangeUtils';
import {
  paginateItems,
  type PaginationParams,
  type PaginationResult,
} from '@maps-react/utils/pagination';
import {
  determineDefaultOrder,
  extractKeyword,
  parseQueryParam,
  QueryParams,
  SortOrder,
} from '../query/queryHelpers';
import { applySorting } from '../sorting/sortUtils';
import { compress, isCompressed, uncompress } from './compress';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface FilterConfig {
  pageType?: string[];
  year?: DateRangeOption;
  countryOfDelivery?: string[];
  topic?: string[];
  clientGroup?: string[];
  organisation?: string[];
  keyword?: string;
  order?: SortOrder;
}

type DocumentFetchError =
  | { type: 'CACHE_ERROR'; message: string; error: true }
  | { type: 'AEM_ERROR'; message: string; error: true }
  | { type: 'VALIDATION_ERROR'; message: string; error: true };

type FilterFunction = (docs: DocumentTemplate[]) => DocumentTemplate[];

// ============================================================================
// Configuration
// ============================================================================

const CACHE_CONFIG = {
  ALL_DOCUMENTS_KEY: 'evidence-hub:all-documents',
  BUILD_ID_KEY: 'evidence-hub:build-id',
  FILTER_RESULTS_PREFIX: 'evidence-hub:filter-results',
  REGISTRY_KEY: 'evidence-hub:registry', // Tracks all evidence-hub cache keys for easy clearing
  // Use a large TTL (365 days in seconds)
  // Cache will be cleared on new builds via build ID check
  NO_EXPIRATION_TTL: 31536000, // 365 days in seconds (365 * 24 * 60 * 60)
  RETRY_MAX_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Request-level memoization for Next.js server-side
// This only lives for the duration of a single request
const requestCache = new Map<string, unknown>();

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Simple request-level memoization for expensive operations
 * Note: This cache is cleared after each request in Next.js
 */
function memoizeForRequest<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (requestCache.has(key)) {
      return requestCache.get(key) as ReturnType<T>;
    }

    const result = fn(...args) as ReturnType<T>;
    requestCache.set(key, result);
    return result;
  }) as T;
}

/**
 * Retry wrapper for async operations
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = CACHE_CONFIG.RETRY_MAX_ATTEMPTS,
  delay = CACHE_CONFIG.RETRY_DELAY,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, attempt - 1)),
      );
    }
  }

  throw lastError;
}

/**
 * Generate a stable cache key from query parameters
 * Includes build ID to ensure cache invalidation when AEM_CACHE changes
 * Used for filter result ID arrays
 */
function generateCacheKey(query: QueryParams): string {
  const buildId = getBuildId();
  const sortedQuery = Object.keys(query)
    .sort((a, b) => a.localeCompare(b))
    .reduce((result, key) => {
      if (query[key]) {
        result[key] = query[key];
      }
      return result;
    }, {} as QueryParams);

  return `${CACHE_CONFIG.FILTER_RESULTS_PREFIX}:${buildId}:${Buffer.from(
    JSON.stringify(sortedQuery),
  ).toString('base64')}`;
}

/**
 * Extract plain text from JsonRichText - memoized per request
 * Optimized to cache results per document to avoid redundant extraction
 */
const extractTextFromRichText = memoizeForRequest(
  ((richText: JsonRichText | undefined): string => {
    if (!richText?.json) return '';

    const extractTextFromNode = (node: Record<string, unknown>): string => {
      let text = '';

      if (node.value) {
        text += String(node.value);
      }

      if (node.content && Array.isArray(node.content)) {
        text += node.content.map(extractTextFromNode).join('');
      }

      return text;
    };

    return richText.json.map(extractTextFromNode).join(' ').trim();
  }) as (richText: unknown) => string,
  (richText: unknown) => (richText ? JSON.stringify(richText) : 'empty'),
) as (richText: JsonRichText | undefined) => string;

/**
 * Check if document tags match any of the selected values
 */
function hasMatchingTags(
  tags: Array<{ key?: string; name?: string }> | undefined,
  selectedValues: string[],
): boolean {
  if (!Array.isArray(tags) || selectedValues.length === 0) {
    return false;
  }

  return selectedValues.some((value) =>
    tags.some((tag) => tag.key === value || tag.name === value),
  );
}

// ============================================================================
// Registry Management (Hybrid Approach)
// ============================================================================

/**
 * Add a key to the evidence-hub registry for tracking
 * This allows us to clear all evidence-hub keys efficiently
 */
async function addKeyToRegistry(key: string): Promise<void> {
  try {
    const registryResponse = await redisRestGet(CACHE_CONFIG.REGISTRY_KEY);
    const registryJson = registryResponse.success
      ? registryResponse.data?.value
      : null;
    let keys: string[] = [];

    if (registryJson) {
      try {
        const parsed = JSON.parse(registryJson);
        // Ensure parsed value is an array
        keys = Array.isArray(parsed) ? parsed : [];
      } catch (parseError) {
        // If parsing fails, start with empty array
        console.warn(
          'Failed to parse registry JSON, starting fresh:',
          parseError,
        );
        keys = [];
      }
    }

    // Only add if not already in registry
    if (!keys.includes(key)) {
      keys.push(key);
      await redisRestSet(CACHE_CONFIG.REGISTRY_KEY, JSON.stringify(keys), {
        ttlSeconds: CACHE_CONFIG.NO_EXPIRATION_TTL,
      });
    }
  } catch (error) {
    // Don't throw - registry tracking is not critical for functionality
    console.warn(`Failed to add key ${key} to registry:`, error);
  }
}

/**
 * Clear all evidence-hub keys using the registry
 * Note: Pattern deletion is not supported by the API, so we rely solely on the registry
 */
async function clearCacheUsingRegistry(): Promise<number> {
  try {
    const registryResponse = await redisRestGet(CACHE_CONFIG.REGISTRY_KEY);
    const registryJson = registryResponse.success
      ? registryResponse.data?.value
      : null;
    if (!registryJson) {
      // Registry doesn't exist - nothing to clear
      console.log('Registry not found, no cache keys to clear');
      return 0;
    }

    let keys: string[] = [];
    try {
      const parsed = JSON.parse(registryJson);
      // Ensure parsed value is an array
      keys = Array.isArray(parsed) ? parsed : [];
    } catch (parseError) {
      // If parsing fails, treat as empty registry
      console.warn(
        'Failed to parse registry JSON, treating as empty:',
        parseError,
      );
      return 0;
    }

    if (keys.length === 0) {
      return 0;
    }

    // Delete all tracked keys
    const deletePromises = keys.map((key) => redisRestDel(key));
    const results = await Promise.all(deletePromises);

    // Count successful deletions (check deletedCount from DeleteResponse)
    const deletedCount = results.filter(
      (result) => result.success && (result.data?.deletedCount ?? 0) > 0,
    ).length;

    // Clear the registry itself
    await redisRestDel(CACHE_CONFIG.REGISTRY_KEY);

    return deletedCount;
  } catch (error) {
    console.error('Error clearing cache using registry:', error);
    // Re-throw the error since we can't fall back to pattern deletion
    throw error;
  }
}

// ============================================================================
// Cache Operations
// ============================================================================

/**
 * Get cached documents with compression support
 * Handles both compressed and uncompressed data for backward compatibility
 */
async function getCachedDocuments(
  cacheKey: string,
): Promise<DocumentTemplate[] | null> {
  try {
    const cachedResponse = await redisRestGet(cacheKey);
    const cached = cachedResponse.success ? cachedResponse.data?.value : null;
    if (!cached) {
      return null;
    }

    // Try to decompress if data appears compressed
    let decompressed: string;
    if (isCompressed(cached)) {
      try {
        decompressed = await uncompress(cached);
      } catch (decompressError) {
        // If decompression fails, try parsing as-is (backward compatibility)
        console.warn(
          `Failed to decompress cache for key ${cacheKey}, trying as plain JSON:`,
          decompressError,
        );
        decompressed = cached;
      }
    } else {
      decompressed = cached;
    }

    const parsed = JSON.parse(decompressed);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error(`Cache read error for key ${cacheKey}:`, error);
  }
  return null;
}

/**
 * Cache documents with compression
 * Uses compression to reduce Redis memory usage
 */
async function cacheDocuments(
  cacheKey: string,
  documents: DocumentTemplate[],
): Promise<void> {
  try {
    const jsonString = JSON.stringify(documents);
    const compressed = await compress(jsonString);

    const setResponse = await redisRestSet(cacheKey, compressed, {
      ttlSeconds: CACHE_CONFIG.NO_EXPIRATION_TTL,
    });

    // Check if it's an error response
    if (!setResponse.success) {
      console.error(
        `Cache write error for key ${cacheKey}:`,
        setResponse.error,
      );
      return;
    }

    // Track this key in registry for easy cache clearing
    await addKeyToRegistry(cacheKey);
  } catch (error) {
    console.error(`Cache write error for key ${cacheKey}:`, error);
    // Don't throw - caching is not critical
  }
}

/**
 * Get cached filter result IDs (array of slugs)
 * Returns null if not found or on error
 */
async function getCachedFilterResultIds(
  cacheKey: string,
): Promise<string[] | null> {
  try {
    const cachedResponse = await redisRestGet(cacheKey);
    const cached = cachedResponse.success ? cachedResponse.data?.value : null;
    if (!cached) {
      return null;
    }

    // Try to decompress if data appears compressed
    let decompressed: string;
    if (isCompressed(cached)) {
      try {
        decompressed = await uncompress(cached);
      } catch (decompressError) {
        // If decompression fails, try parsing as-is (backward compatibility)
        console.warn(
          `Failed to decompress filter IDs for key ${cacheKey}, trying as plain JSON:`,
          decompressError,
        );
        decompressed = cached;
      }
    } else {
      decompressed = cached;
    }

    const parsed = JSON.parse(decompressed);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === 'string')
    ) {
      return parsed;
    }
  } catch (error) {
    console.error(`Cache read error for filter IDs key ${cacheKey}:`, error);
  }
  return null;
}

/**
 * Cache filter result IDs (array of slugs) with compression
 */
async function cacheFilterResultIds(
  cacheKey: string,
  slugs: string[],
): Promise<void> {
  try {
    const jsonString = JSON.stringify(slugs);
    const compressed = await compress(jsonString);

    await redisRestSet(cacheKey, compressed, {
      ttlSeconds: CACHE_CONFIG.NO_EXPIRATION_TTL,
    });
    // Track this key in registry for easy cache clearing
    await addKeyToRegistry(cacheKey);
  } catch (error) {
    console.error(`Cache write error for filter IDs key ${cacheKey}:`, error);
    // Don't throw - caching is not critical
  }
}

/**
 * Get documents by their slugs from the full document set
 * Preserves the order of slugs in the input array
 */
function getDocumentsBySlugs(
  slugs: string[],
  allDocuments: DocumentTemplate[],
): DocumentTemplate[] {
  // Create a map for O(1) lookup
  const documentMap = new Map<string, DocumentTemplate>();
  for (const doc of allDocuments) {
    if (doc.slug) {
      documentMap.set(doc.slug, doc);
    }
  }

  // Preserve order from slugs array, skip missing ones
  const result: DocumentTemplate[] = [];
  for (const slug of slugs) {
    const doc = documentMap.get(slug);
    if (doc) {
      result.push(doc);
    } else {
      console.warn(`Document with slug "${slug}" not found in document set`);
    }
  }

  return result;
}

/**
 * Get current build ID from environment or generate one
 */
function getBuildId(): string {
  // Netlify provides COMMIT_REF which is the commit SHA
  // This changes on every new build/deployment
  return process.env.AEM_CACHE || `build-${Date.now()}`;
}

/**
 * Check if this is a new build and clear cache if needed
 * When AEM_CACHE date changes, clears all evidence-hub Redis keys
 */
async function checkAndClearCacheOnNewBuild(): Promise<void> {
  try {
    const currentBuildId = getBuildId();
    const cachedBuildIdResponse = await redisRestGet(CACHE_CONFIG.BUILD_ID_KEY);
    const cachedBuildId = cachedBuildIdResponse.success
      ? cachedBuildIdResponse.data?.value
      : null;

    // If build ID matches, reuse existing cache
    if (cachedBuildId === currentBuildId) {
      console.log(`Reusing cache for build: ${currentBuildId}`);
      return;
    }

    // Build ID has changed or doesn't exist, clear all evidence-hub keys
    console.log(
      `New build detected (${currentBuildId}). Previous: ${cachedBuildId}. Clearing evidence-hub cache...`,
    );

    // Clear all evidence-hub keys using registry (with pattern deletion fallback)
    try {
      const deletedCount = await clearCacheUsingRegistry();
      console.log(`Cleared ${deletedCount} evidence-hub cache keys`);
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Fallback: try to clear known keys individually
      try {
        await redisRestDel(CACHE_CONFIG.ALL_DOCUMENTS_KEY);
        await redisRestDel(CACHE_CONFIG.BUILD_ID_KEY);
        await redisRestDel(CACHE_CONFIG.REGISTRY_KEY);
        console.log('Cleared evidence-hub cache using fallback method');
      } catch (fallbackError) {
        console.error(
          'Error clearing cache with fallback method:',
          fallbackError,
        );
      }
    }

    // Store new build ID (using helper with very large TTL)
    await redisRestSet(CACHE_CONFIG.BUILD_ID_KEY, currentBuildId, {
      ttlSeconds: CACHE_CONFIG.NO_EXPIRATION_TTL,
    });
    // Track build-id key in registry
    await addKeyToRegistry(CACHE_CONFIG.BUILD_ID_KEY);

    console.log('Evidence-hub cache cleared and new build ID stored');
  } catch (error) {
    console.error('Error checking build ID:', error);
    // Don't throw - allow build to continue even if cache check fails
  }
}

/**
 * Clear all evidence hub caches
 */
export async function clearEvidenceHubCache(): Promise<void> {
  try {
    // Use registry to clear all evidence-hub keys (with pattern deletion fallback)
    const deletedCount = await clearCacheUsingRegistry();
    console.log(`Cleared ${deletedCount} evidence-hub cache keys`);
  } catch (error) {
    console.error('Failed to clear evidence hub cache:', error);
    // Fallback: try to clear known keys individually
    try {
      await redisRestDel(CACHE_CONFIG.ALL_DOCUMENTS_KEY);
      await redisRestDel(CACHE_CONFIG.BUILD_ID_KEY);
      await redisRestDel(CACHE_CONFIG.REGISTRY_KEY);
    } catch (fallbackError) {
      console.error(
        'Failed to clear evidence hub cache with fallback:',
        fallbackError,
      );
    }
  }
}

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Create filter for page types
 */
function createPageTypeFilter(pageTypes: string[]): FilterFunction {
  if (pageTypes.length === 0) return (docs) => docs;

  return (docs) =>
    docs.filter(
      (doc) => doc.pageType?.key && pageTypes.includes(doc.pageType.key),
    );
}

/**
 * Create filter for date range
 */
function createDateRangeFilter(dateRange: DateRange | null): FilterFunction {
  if (!dateRange) return (docs) => docs;

  const { startDate, endDate } = dateRange;

  return (docs) =>
    docs.filter((doc) => {
      if (!doc.publishDate) return false;
      const docDate = new Date(doc.publishDate);
      return docDate >= startDate && docDate <= endDate;
    });
}

/**
 * Create OR filter (matches if ANY condition is true)
 */
function createOrFilter(
  filters: Record<string, string[]>,
  filterKeys: string[],
): FilterFunction {
  const activeFilters = Object.entries(filters).filter(
    ([key, values]) => filterKeys.includes(key) && values.length > 0,
  );

  if (activeFilters.length === 0) return (docs) => docs;

  // Map filter keys to document properties explicitly
  const propertyMap: Record<string, keyof DocumentTemplate> = {
    countryOfDelivery: 'countryOfDelivery',
    topic: 'topic',
    clientGroup: 'clientGroup',
    organisation: 'organisation',
  };

  return (docs) =>
    docs.filter((doc) =>
      activeFilters.some(([key, values]) => {
        const propertyName = propertyMap[key];
        if (!propertyName) return false;

        const tags = doc[propertyName] as
          | Array<{
              key?: string;
              name?: string;
            }>
          | undefined;
        return hasMatchingTags(tags, values);
      }),
    );
}

/**
 * Check if title contains the search term
 */
function titleContainsSearchTerm(
  title: string | undefined,
  searchTerm: string,
): boolean {
  if (!title || typeof title !== 'string') return false;
  return title.toLowerCase().includes(searchTerm);
}

/**
 * Check if overview contains the search term
 * Uses memoized text extraction for performance
 */
function overviewContainsSearchTerm(
  overview: JsonRichText | undefined,
  searchTerm: string,
): boolean {
  if (!overview) return false;
  const overviewText = extractTextFromRichText(overview).toLowerCase();
  return overviewText.length > 0 && overviewText.includes(searchTerm);
}

/**
 * Check if any section contains the search term
 * Uses memoized text extraction for performance
 */
function sectionsContainSearchTerm(
  sections: JsonRichText[] | undefined,
  searchTerm: string,
): boolean {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return false;
  }

  for (const section of sections) {
    if (!section) continue;
    const sectionText = extractTextFromRichText(section).toLowerCase();
    if (sectionText.length > 0 && sectionText.includes(searchTerm)) {
      return true;
    }
  }

  return false;
}

/**
 * Create keyword search filter
 * Explicitly checks title, overview, and sections to ensure keyword exists
 * in at least one of these fields with defensive checks to prevent false positives
 */
function createKeywordFilter(keyword: string): FilterFunction {
  if (!keyword || typeof keyword !== 'string') return (docs) => docs;

  const searchTerm = keyword.trim().toLowerCase();

  // Defensive check: ensure keyword is not empty after trimming
  if (searchTerm.length === 0) return (docs) => docs;

  return (docs) =>
    docs.filter((doc) => {
      // Defensive check: ensure doc exists
      if (!doc) return false;

      return (
        titleContainsSearchTerm(doc.title, searchTerm) ||
        overviewContainsSearchTerm(doc.overview, searchTerm) ||
        sectionsContainSearchTerm(doc.sections, searchTerm)
      );
    });
}

// ============================================================================
// Data Fetching
// ============================================================================

/**
 * Fetch all documents from AEM
 */
async function fetchAllDocumentsFromAEM(): Promise<DocumentTemplate[]> {
  const queryName = 'evidence-hub/get-documents-en';

  const response = await withRetry(async () => {
    const { data } = await aemHeadlessClient.runPersistedQuery(queryName);
    return data?.pageSectionTemplateList?.items || [];
  });

  return Array.isArray(response) ? response : [];
}

/**
 * Get all documents (from cache or AEM)
 * Checks for new build and clears cache if needed
 */
export async function getAllDocuments(): Promise<DocumentTemplate[]> {
  // Check if this is a new build and clear cache if needed
  await checkAndClearCacheOnNewBuild();

  // Try cache first
  const cached = await getCachedDocuments(CACHE_CONFIG.ALL_DOCUMENTS_KEY);
  if (cached) {
    return cached;
  }

  // Fetch from AEM
  try {
    const documents = await fetchAllDocumentsFromAEM();

    // Cache for future requests (without expiration)
    await cacheDocuments(CACHE_CONFIG.ALL_DOCUMENTS_KEY, documents);

    return documents;
  } catch (error) {
    console.error('Failed to fetch documents from AEM:', error);
    return [];
  }
}

/**
 * Parse query into filter configuration
 * Uses shared utilities for consistency
 */
function parseQueryToFilters(query: QueryParams): FilterConfig {
  const keyword = extractKeyword(query);
  const order = determineDefaultOrder(keyword, query.order);

  return {
    pageType: parseQueryParam(query.pageType),
    year: (query.year || query.publishDate) as DateRangeOption,
    countryOfDelivery: parseQueryParam(query.countryOfDelivery),
    topic: parseQueryParam(query.topic),
    clientGroup: parseQueryParam(query.clientGroup),
    organisation: parseQueryParam(query.organisation),
    keyword,
    order,
  };
}

/**
 * Build filter pipeline from configuration
 * Optimized with early returns and clearer composition
 */
function buildFilterPipeline(config: FilterConfig): FilterFunction {
  const filters: FilterFunction[] = [];

  // Page type filter
  if (config.pageType?.length) {
    filters.push(createPageTypeFilter(config.pageType));
  }

  // Date range filter
  if (config.year && config.year !== 'all') {
    const dateRange = getDateRange(config.year);
    if (dateRange) {
      filters.push(createDateRangeFilter(dateRange));
    }
  }

  // OR filters (ANY match)
  const orFilterValues = {
    countryOfDelivery: config.countryOfDelivery || [],
    topic: config.topic || [],
    clientGroup: config.clientGroup || [],
    organisation: config.organisation || [],
  };

  const hasOrFilters = Object.values(orFilterValues).some((v) => v.length > 0);
  if (hasOrFilters) {
    filters.push(
      createOrFilter(orFilterValues, [
        'countryOfDelivery',
        'topic',
        'clientGroup',
        'organisation',
      ]),
    );
  }

  // Keyword search filter (applied last for better performance)
  if (config.keyword) {
    filters.push(createKeywordFilter(config.keyword));
  }

  // Compose all filters - early return if no filters
  if (filters.length === 0) {
    return (docs) => docs;
  }

  return (documents) =>
    filters.reduce((docs, filter) => filter(docs), documents);
}

/**
 * Get filtered documents using ID-based caching
 * Caches only document slugs (IDs) for filtered queries, reducing memory usage
 */
async function getFilteredDocuments(
  query: QueryParams,
): Promise<DocumentTemplate[]> {
  const cacheKey = generateCacheKey(query);

  // Try cache for filter result IDs first
  const cachedSlugs = await getCachedFilterResultIds(cacheKey);
  if (cachedSlugs) {
    // Get all documents (already cached, compressed)
    const allDocuments = await getAllDocuments();
    // Filter documents by slugs, preserving order
    return getDocumentsBySlugs(cachedSlugs, allDocuments);
  }

  // Cache miss - filter and sort documents
  const allDocuments = await getAllDocuments();

  // Parse query and build filters
  const filterConfig = parseQueryToFilters(query);
  const filterPipeline = buildFilterPipeline(filterConfig);

  // Apply filters
  const filteredDocuments = filterPipeline(allDocuments);

  // Apply sorting using unified function
  const sortedDocuments = applySorting(
    filteredDocuments,
    filterConfig.order,
    filterConfig.keyword,
  );

  // Extract slugs from filtered results
  const slugs = sortedDocuments
    .map((doc) => doc.slug)
    .filter((slug): slug is string => Boolean(slug));

  // Cache only the IDs (slugs) for this filter query
  await cacheFilterResultIds(cacheKey, slugs);

  return sortedDocuments;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Create standardized error response
 */
function createError(
  type: 'CACHE_ERROR' | 'AEM_ERROR' | 'VALIDATION_ERROR',
  message: string,
): DocumentFetchError {
  return { type, message, error: true };
}

/**
 * Handle errors and return appropriate error response
 */
function handleError(error: unknown): DocumentFetchError {
  console.error('Document fetch error:', error);

  if (error instanceof Error) {
    if (error.message.includes('cache')) {
      return createError('CACHE_ERROR', error.message);
    }
    if (error.message.includes('AEM') || error.message.includes('query')) {
      return createError('AEM_ERROR', error.message);
    }
  }

  return createError('AEM_ERROR', 'Failed to fetch documents');
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Fetch documents with pagination support
 * @param query - Query parameters including filters
 * @param paginationParams - Pagination parameters
 * @returns Paginated result with documents and pagination metadata
 */
export async function fetchDocumentsPaginated(
  query: QueryParams = {},
  paginationParams: PaginationParams = {},
): Promise<PaginationResult<DocumentTemplate> | DocumentFetchError> {
  try {
    if (paginationParams.page && paginationParams.page < 1) {
      paginationParams.page = 1;
    }

    // Get filtered documents
    const filteredDocuments = await getFilteredDocuments(query);

    // Apply pagination
    const paginatedResult = paginateItems(filteredDocuments, paginationParams);

    return paginatedResult;
  } catch (error) {
    return handleError(error);
  }
}

// ============================================================================
// Cache Warming (Optional - can be called from API route or cron job)
// ============================================================================

/**
 * Warm cache with common filter combinations
 * This can be called from a Next.js API route or a cron job
 */
export async function warmCache(): Promise<void> {
  const commonQueries = [
    {}, // All documents
    { pageType: 'evaluation' },
    { pageType: 'review' },
    { pageType: 'insight' },
    { year: 'last-2' },
    { year: 'last-5' },
    { topic: 'savings' },
    { topic: 'debt' },
  ];

  for (const query of commonQueries) {
    try {
      await getFilteredDocuments(query);
      console.log(`Warmed cache for query:`, query);
    } catch (error) {
      console.error(`Failed to warm cache for query:`, query, error);
    }
  }
}

// ============================================================================
// Build-Time Cache Warming
// ============================================================================

/**
 * Warm cache during build time
 * This should be called during Netlify build process
 * Can be invoked from a build script or Next.js build hook
 */
export async function warmCacheOnBuild(): Promise<void> {
  try {
    console.log('Starting build-time cache warming...');

    // Check and clear cache if this is a new build
    await checkAndClearCacheOnNewBuild();

    // Fetch and cache all documents
    const documents = await fetchAllDocumentsFromAEM();
    await cacheDocuments(CACHE_CONFIG.ALL_DOCUMENTS_KEY, documents);

    console.log(`Cached ${documents.length} documents during build`);

    // Optionally warm common filter combinations
    const commonQueries = [
      { pageType: 'evalutation' },
      { pageType: 'review' },
      { year: 'last-2' },
      { year: 'last-5' },
      { topic: 'savings' },
      { topic: 'debt' },
    ];

    for (const query of commonQueries) {
      try {
        // Use getFilteredDocuments to properly cache IDs
        await getFilteredDocuments(query);
        console.log(`Warmed cache for query:`, query);
      } catch (error) {
        console.error(`Failed to warm cache for query:`, query, error);
      }
    }

    console.log('Build-time cache warming completed');
  } catch (error) {
    console.error('Error during build-time cache warming:', error);
    // Don't throw - allow build to continue even if cache warming fails
  }
}

// Clear request cache after each request (for Next.js App Router)
// This would typically be called in middleware or at the end of request processing
export function clearRequestCache(): void {
  requestCache.clear();
}
