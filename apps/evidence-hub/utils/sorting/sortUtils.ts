import { DocumentTemplate } from 'types/@adobe/page';

import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { SortOrder } from '../query/queryHelpers';

/**
 * Extended document type for sorting operations
 */
interface SearchableDocument extends DocumentTemplate {
  _searchableText?: string;
  _matchPriority?: number;
  _isExactMatch?: boolean;
}

/**
 * Cache for extracted text per document during sorting operations
 * This avoids re-extracting text multiple times for the same document
 */
const textExtractionCache = new WeakMap<
  DocumentTemplate,
  {
    overview?: string;
    sections?: Map<JsonRichText, string>;
  }
>();

/**
 * Extract plain text from JsonRichText
 * Uses caching to avoid redundant extraction
 */
function extractTextFromRichText(richText: JsonRichText | undefined): string {
  if (!richText?.json) return '';

  const extractTextFromNode = (node: Record<string, unknown>): string => {
    let text = '';

    if (node.value) {
      text += node.value;
    }

    if (node.content && Array.isArray(node.content)) {
      text += node.content.map(extractTextFromNode).join('');
    }

    return text;
  };

  return richText.json.map(extractTextFromNode).join(' ').trim();
}

/**
 * Get cached or extract text from rich text
 */
function getCachedText(
  doc: DocumentTemplate,
  richText: JsonRichText | undefined,
  field: 'overview' | 'sections',
  sectionIndex?: number,
): string {
  let cache = textExtractionCache.get(doc);
  if (!cache) {
    cache = { sections: new Map() };
    textExtractionCache.set(doc, cache);
  }

  if (field === 'overview') {
    if (!cache.overview) {
      cache.overview = extractTextFromRichText(richText);
    }
    return cache.overview;
  }

  // For sections
  cache.sections ??= new Map();

  if (richText && sectionIndex !== undefined) {
    if (!cache.sections.has(richText)) {
      cache.sections.set(richText, extractTextFromRichText(richText));
    }
    return cache.sections.get(richText) || '';
  }

  return extractTextFromRichText(richText);
}

/**
 * Escape special regex characters
 */
function escapeRegexChars(searchTerm: string): string {
  const specialChars = [
    '.',
    '*',
    '+',
    '?',
    '^',
    '$',
    '{',
    '}',
    '(',
    ')',
    '|',
    '[',
    ']',
    '\\',
  ];
  let escaped = searchTerm;
  for (const char of specialChars) {
    escaped = escaped.replaceAll(char, `\\${char}`);
  }
  return escaped;
}

/**
 * Determine keyword match priority for a document
 * Priority: 1 = title, 2 = overview, 3 = sections, 4 = no match
 * Also sets _isExactMatch flag to indicate if the match is an exact word match
 */
function getKeywordMatchPriority(
  doc: SearchableDocument,
  keyword: string,
): { priority: number; isExactMatch: boolean } {
  const searchTerm = keyword.toLowerCase();
  const escapedSearchTerm = escapeRegexChars(searchTerm);
  const exactMatchRegex = new RegExp(String.raw`\b${escapedSearchTerm}\b`, 'i');

  // Check title (priority 1)
  if (doc.title?.toLowerCase().includes(searchTerm)) {
    const isExactMatch = exactMatchRegex.test(doc.title);
    return { priority: 1, isExactMatch };
  }

  // Check overview (priority 2)
  const overviewText = getCachedText(
    doc,
    doc.overview,
    'overview',
  ).toLowerCase();
  if (overviewText.includes(searchTerm)) {
    const originalOverviewText = getCachedText(doc, doc.overview, 'overview');
    const isExactMatch = exactMatchRegex.test(originalOverviewText);
    return { priority: 2, isExactMatch };
  }

  // Check sections (priority 3)
  if (doc.sections) {
    for (let i = 0; i < doc.sections.length; i++) {
      const section = doc.sections[i];
      const sectionText = getCachedText(
        doc,
        section,
        'sections',
        i,
      ).toLowerCase();
      if (sectionText.includes(searchTerm)) {
        const originalSectionText = getCachedText(doc, section, 'sections', i);
        const isExactMatch = exactMatchRegex.test(originalSectionText);
        return { priority: 3, isExactMatch };
      }
    }
  }

  // No match (shouldn't happen after filtering, but safe default)
  return { priority: 4, isExactMatch: false };
}

/**
 * Sort documents by keyword relevance
 * Documents with keyword in title appear first, then overview, then sections
 * Within the same priority level, exact word matches appear before partial matches
 * Optimized to avoid unnecessary object creation
 */
export function sortByKeywordRelevance(
  documents: DocumentTemplate[],
  keyword: string,
): DocumentTemplate[] {
  if (!keyword || keyword.trim() === '') {
    return documents;
  }

  // Create array with match info (avoid creating new document objects)
  const documentsWithMatchInfo = documents.map((doc) => {
    const searchableDoc = doc as SearchableDocument;
    const matchInfo = getKeywordMatchPriority(searchableDoc, keyword);
    searchableDoc._matchPriority = matchInfo.priority;
    searchableDoc._isExactMatch = matchInfo.isExactMatch;
    return searchableDoc;
  });

  // Sort by priority first, then by exact match status
  return documentsWithMatchInfo.sort((a, b) => {
    const priorityA = a._matchPriority ?? 4;
    const priorityB = b._matchPriority ?? 4;

    // First sort by priority (ascending - lower number = higher priority)
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // If priorities are equal, sort by exact match status (exact matches first)
    const exactA = a._isExactMatch ?? false;
    const exactB = b._isExactMatch ?? false;

    if (exactA !== exactB) {
      // true (exact) comes before false (partial), so return -1 if A is exact
      return exactA ? -1 : 1;
    }

    // Maintain stable sort for equal matches
    return 0;
  });
}

/**
 * Sort documents by publishDate (newest first)
 * Sorts documents by their original publication date in descending order
 */
export function sortByPublishDate(
  documents: DocumentTemplate[],
): DocumentTemplate[] {
  // Create a copy to avoid mutating the original array
  return [...documents].sort((a, b) => {
    const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
    const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
}

/**
 * Sort documents by lastUpdatedDate (most recently updated first)
 * Sorts documents by when they were last modified/updated in descending order
 */
export function sortByLastUpdatedDate(
  documents: DocumentTemplate[],
): DocumentTemplate[] {
  // Create a copy to avoid mutating the original array
  return [...documents].sort((a, b) => {
    const dateA = a.lastUpdatedDate ? new Date(a.lastUpdatedDate).getTime() : 0;
    const dateB = b.lastUpdatedDate ? new Date(b.lastUpdatedDate).getTime() : 0;
    return dateB - dateA; // Descending order (most recently updated first)
  });
}

/**
 * Apply sorting to documents based on order and keyword
 * Unified function that handles all sorting logic
 */
export function applySorting(
  documents: DocumentTemplate[],
  order: SortOrder | undefined,
  keyword: string | undefined,
): DocumentTemplate[] {
  if (order === 'published') {
    return sortByPublishDate(documents);
  }

  if (order === 'updated') {
    return sortByLastUpdatedDate(documents);
  }

  if ((order === 'relevance' || !order) && keyword) {
    return sortByKeywordRelevance(documents, keyword);
  }

  // Default sort: by publishDate when no order specified and no keyword
  return sortByPublishDate(documents);
}
