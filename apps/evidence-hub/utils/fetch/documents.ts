import { DocumentTemplate } from 'types/@adobe/page';

import {
  paginateItems,
  type PaginationParams,
  type PaginationResult,
} from '@maps-react/utils/pagination';

import {
  buildFilterPipeline,
  parseQueryToFilters,
} from '../filter/documentFilters';
import { QueryParams } from '../query/queryHelpers';
import {
  getMatchingSlugs,
  sortBySearchRelevance,
} from '../search/keywordSearch';
import { sortByLastUpdatedDate, sortByPublishDate } from '../sorting/sortUtils';
import {
  ensureSlimCaches,
  type SearchTextBySlug,
  type SlimDocument,
} from './documentsCache';

export { clearEvidenceHubCache } from './documentsCache';

type DocumentFetchError =
  | { type: 'CACHE_ERROR'; message: string; error: true }
  | { type: 'AEM_ERROR'; message: string; error: true }
  | { type: 'VALIDATION_ERROR'; message: string; error: true };

function sortSlimDocsByRelevance(
  docs: SlimDocument[],
  keyword: string,
  searchBySlug: SearchTextBySlug,
): SlimDocument[] {
  return sortBySearchRelevance(
    docs,
    keyword,
    (doc) => (doc.slug ? searchBySlug.get(doc.slug) : undefined),
    (doc) => (doc.publishDate ? new Date(doc.publishDate).getTime() : 0),
    (doc) => doc.title,
  );
}

async function getFilteredDocuments(
  query: QueryParams,
): Promise<DocumentTemplate[]> {
  const filterConfig = parseQueryToFilters(query);
  const keyword = filterConfig.keyword;
  const { docsSlim, searchBySlug } = await ensureSlimCaches();

  const matchingSlugSet = keyword
    ? getMatchingSlugs(keyword, searchBySlug)
    : undefined;

  const filterPipeline = buildFilterPipeline({
    ...filterConfig,
    keyword: undefined,
  });

  const filteredDocuments = filterPipeline(docsSlim);

  const keywordFilteredDocuments =
    keyword && matchingSlugSet
      ? filteredDocuments.filter(
          (doc) => Boolean(doc.slug) && matchingSlugSet.has(doc.slug),
        )
      : filteredDocuments;

  if (keyword && (filterConfig.order === 'relevance' || !filterConfig.order)) {
    return sortSlimDocsByRelevance(
      keywordFilteredDocuments,
      keyword,
      searchBySlug,
    );
  }
  if (filterConfig.order === 'updated') {
    return sortByLastUpdatedDate(keywordFilteredDocuments);
  }
  return sortByPublishDate(keywordFilteredDocuments);
}

function createError(
  type: 'CACHE_ERROR' | 'AEM_ERROR' | 'VALIDATION_ERROR',
  message: string,
): DocumentFetchError {
  return { type, message, error: true };
}

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

export async function fetchDocumentsPaginated(
  query: QueryParams = {},
  paginationParams: PaginationParams = {},
): Promise<PaginationResult<DocumentTemplate> | DocumentFetchError> {
  try {
    if (paginationParams.page && paginationParams.page < 1) {
      paginationParams.page = 1;
    }

    const filteredDocuments = await getFilteredDocuments(query);
    const paginatedResult = paginateItems(filteredDocuments, paginationParams);
    const { page, totalPages } = paginatedResult.pagination;

    if (totalPages > 0 && page > totalPages) {
      return paginateItems(filteredDocuments, { ...paginationParams, page: 1 });
    }

    return paginatedResult;
  } catch (error) {
    return handleError(error);
  }
}
