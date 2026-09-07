import { compareDocumentTitles } from '../sorting/sortUtils';

export type DocSearchEntry = {
  titleText: string;
  overviewText: string;
  sectionsText: string;
  combinedText: string;
};

export type SearchRelevanceScore = {
  priority: number;
  phraseMatch: boolean;
  exact: boolean;
  titleTokenHits: number;
  overviewTokenHits: number;
};

export type ParsedSearchKeyword = {
  term: string;
  tokens: string[];
  exactMatchRegex: RegExp;
};

export function normalizeForSearch(s: string): string {
  return s
    .replaceAll('\u00A0', ' ') // NBSP -> space
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim()
    .toLowerCase();
}

export function tokenizeSearchKeyword(term: string): string[] {
  if (!term) return [];
  return [...new Set(term.split(' ').filter(Boolean))];
}

export function tokensCoveredBy(tokens: string[], texts: string[]): boolean {
  return tokens.every((token) => texts.some((text) => text.includes(token)));
}

export function parseSearchKeyword(
  keyword: string,
): ParsedSearchKeyword | null {
  const term = normalizeForSearch(keyword);
  if (!term) return null;

  const tokens = tokenizeSearchKeyword(term);
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  // Word boundaries require a word/non-word transition; punctuation-heavy
  // queries may not set exact: true even when the phrase substring matches.
  const exactMatchRegex = new RegExp(String.raw`\b${escaped}\b`, 'i');

  return { term, tokens, exactMatchRegex };
}

function documentMatchesKeywordWithParsed(
  entry: DocSearchEntry,
  parsed: ParsedSearchKeyword,
): boolean {
  if (entry.combinedText.includes(parsed.term)) return true;
  if (parsed.tokens.length <= 1) return false;
  return tokensCoveredBy(parsed.tokens, [entry.combinedText]);
}

export function documentMatchesKeyword(
  entry: DocSearchEntry,
  keyword: string | ParsedSearchKeyword,
): boolean {
  const parsed =
    typeof keyword === 'string' ? parseSearchKeyword(keyword) : keyword;
  if (!parsed) return false;
  return documentMatchesKeywordWithParsed(entry, parsed);
}

export function countTokenHits(text: string, tokens: string[]): number {
  return tokens.filter((token) => text.includes(token)).length;
}

export function getMatchingSlugs(
  keyword: string,
  searchBySlug: Map<string, DocSearchEntry>,
): Set<string> {
  const parsed = parseSearchKeyword(keyword);
  if (!parsed) return new Set();

  const slugs: string[] = [];
  for (const [slug, entry] of searchBySlug.entries()) {
    if (documentMatchesKeywordWithParsed(entry, parsed)) slugs.push(slug);
  }
  return new Set(slugs);
}

function scoreSearchRelevanceWithParsed(
  entry: DocSearchEntry | undefined,
  parsed: ParsedSearchKeyword,
): SearchRelevanceScore {
  if (!entry) {
    return {
      priority: 4,
      phraseMatch: false,
      exact: false,
      titleTokenHits: 0,
      overviewTokenHits: 0,
    };
  }

  const { term, tokens, exactMatchRegex } = parsed;

  const titleTokenHits = countTokenHits(entry.titleText, tokens);
  const overviewTokenHits = countTokenHits(entry.overviewText, tokens);

  if (
    entry.titleText.includes(term) ||
    tokensCoveredBy(tokens, [entry.titleText])
  ) {
    return {
      priority: 1,
      phraseMatch: entry.titleText.includes(term),
      exact:
        entry.titleText.includes(term) && exactMatchRegex.test(entry.titleText),
      titleTokenHits,
      overviewTokenHits,
    };
  }

  if (
    entry.overviewText.includes(term) ||
    tokensCoveredBy(tokens, [entry.titleText, entry.overviewText])
  ) {
    return {
      priority: 2,
      phraseMatch: entry.overviewText.includes(term),
      exact:
        entry.overviewText.includes(term) &&
        exactMatchRegex.test(entry.overviewText),
      titleTokenHits,
      overviewTokenHits,
    };
  }

  if (
    entry.sectionsText.includes(term) ||
    tokensCoveredBy(tokens, [
      entry.titleText,
      entry.overviewText,
      entry.sectionsText,
    ])
  ) {
    return {
      priority: 3,
      phraseMatch: entry.sectionsText.includes(term),
      exact:
        entry.sectionsText.includes(term) &&
        exactMatchRegex.test(entry.sectionsText),
      titleTokenHits,
      overviewTokenHits,
    };
  }

  return {
    priority: 4,
    phraseMatch: false,
    exact: false,
    titleTokenHits,
    overviewTokenHits,
  };
}

/**
 * Score how well a document entry matches a keyword.
 * When scoring many entries for the same keyword, call `parseSearchKeyword`
 * once and pass the `ParsedSearchKeyword` to avoid repeated
 * normalization, tokenization, and regex work.
 */
export function scoreSearchRelevance(
  entry: DocSearchEntry | undefined,
  keyword: string | ParsedSearchKeyword,
): SearchRelevanceScore {
  const parsed =
    typeof keyword === 'string' ? parseSearchKeyword(keyword) : keyword;

  if (!parsed) {
    return {
      priority: 4,
      phraseMatch: false,
      exact: false,
      titleTokenHits: 0,
      overviewTokenHits: 0,
    };
  }

  return scoreSearchRelevanceWithParsed(entry, parsed);
}

export function compareSearchRelevance(
  a: SearchRelevanceScore,
  b: SearchRelevanceScore,
  dateA: number,
  dateB: number,
  titleA?: string,
  titleB?: string,
): number {
  if (a.priority !== b.priority) return a.priority - b.priority;
  if (a.phraseMatch !== b.phraseMatch) return a.phraseMatch ? -1 : 1;
  if (!a.phraseMatch && !b.phraseMatch) {
    if (a.titleTokenHits !== b.titleTokenHits) {
      return b.titleTokenHits - a.titleTokenHits;
    }
    if (a.overviewTokenHits !== b.overviewTokenHits) {
      return b.overviewTokenHits - a.overviewTokenHits;
    }
  }
  if (a.exact !== b.exact) return a.exact ? -1 : 1;
  if (dateB !== dateA) return dateB - dateA;
  return compareDocumentTitles(titleA, titleB);
}

export function sortBySearchRelevance<T>(
  items: T[],
  keyword: string,
  getEntry: (item: T) => DocSearchEntry | undefined,
  getDate: (item: T) => number,
  getTitle?: (item: T) => string | undefined,
): T[] {
  const parsed = parseSearchKeyword(keyword);
  if (!parsed) return items;

  const scored = items.map((item) => ({
    item,
    score: scoreSearchRelevanceWithParsed(getEntry(item), parsed),
    date: getDate(item),
    title: getTitle?.(item),
  }));

  scored.sort((a, b) =>
    compareSearchRelevance(a.score, b.score, a.date, b.date, a.title, b.title),
  );

  return scored.map((s) => s.item);
}
