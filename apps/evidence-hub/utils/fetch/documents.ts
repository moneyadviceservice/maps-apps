import { DocumentTemplate } from 'types/@adobe/page';

import { redisGet, redisSet } from '@maps-react/redis/helpers';
import { aemHeadlessClient } from '@maps-react/utils/aemHeadlessClient';
import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import {
  DateRange,
  DateRangeOption,
  getDateRange,
} from '../filter/dateRangeUtils';
import {
  paginateItems,
  PaginationParams,
  PaginationResult,
} from '../pagination/paginationUtils';
import {
  determineDefaultOrder,
  extractKeyword,
  parseQueryParam,
  QueryParams,
  SortOrder,
} from '../query/queryHelpers';
import { applySorting } from '../sorting/sortUtils';

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
  ALL_DOCUMENTS_TTL: Number.parseInt(
    process.env.EVIDENCE_HUB_CACHE_TTL || '3600',
    10,
  ),
  FILTERED_TTL: Number.parseInt(
    process.env.EVIDENCE_HUB_FILTERED_CACHE_TTL || '3600',
    10,
  ),
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
 */
function generateCacheKey(query: QueryParams): string {
  const sortedQuery = Object.keys(query)
    .sort((a, b) => a.localeCompare(b))
    .reduce((result, key) => {
      if (query[key]) {
        result[key] = query[key];
      }
      return result;
    }, {} as QueryParams);

  return `evidence-hub:documents:${Buffer.from(
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
// Cache Operations
// ============================================================================

/**
 * Get cached documents
 */
async function getCachedDocuments(
  cacheKey: string,
): Promise<DocumentTemplate[] | null> {
  try {
    const cached = await redisGet(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(`Cache read error for key ${cacheKey}:`, error);
  }
  return null;
}

/**
 * Cache documents
 */
async function cacheDocuments(
  cacheKey: string,
  documents: DocumentTemplate[],
  ttl: number,
): Promise<void> {
  try {
    await redisSet(cacheKey, JSON.stringify(documents), ttl);
  } catch (error) {
    console.error(`Cache write error for key ${cacheKey}:`, error);
    // Don't throw - caching is not critical
  }
}

/**
 * Clear all evidence hub caches
 */
export async function clearEvidenceHubCache(): Promise<void> {
  try {
    await redisSet(CACHE_CONFIG.ALL_DOCUMENTS_KEY, '', 0);
    // In a production environment, you might want to use Redis SCAN
    // to find and delete all keys matching 'evidence-hub:*' pattern
  } catch (error) {
    console.error('Failed to clear evidence hub cache:', error);
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
 */
export async function getAllDocuments(): Promise<DocumentTemplate[]> {
  // Try cache first
  const cached = await getCachedDocuments(CACHE_CONFIG.ALL_DOCUMENTS_KEY);
  if (cached) {
    return cached;
  }

  // Fetch from AEM
  try {
    const documents = await fetchAllDocumentsFromAEM();

    // Cache for future requests
    await cacheDocuments(
      CACHE_CONFIG.ALL_DOCUMENTS_KEY,
      documents,
      CACHE_CONFIG.ALL_DOCUMENTS_TTL,
    );

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
 * Get filtered documents
 */
async function getFilteredDocuments(
  query: QueryParams,
): Promise<DocumentTemplate[]> {
  const cacheKey = generateCacheKey(query);

  // Try cache first
  const cached = await getCachedDocuments(cacheKey);
  if (cached) {
    return cached;
  }

  // Get all documents
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

  // Cache filtered results
  await cacheDocuments(cacheKey, sortedDocuments, CACHE_CONFIG.FILTERED_TTL);

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
    { pageType: 'evalutation' },
    { pageType: 'review' },
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

// Clear request cache after each request (for Next.js App Router)
// This would typically be called in middleware or at the end of request processing
export function clearRequestCache(): void {
  requestCache.clear();
}
