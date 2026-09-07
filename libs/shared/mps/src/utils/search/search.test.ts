import {
  compareSearchRelevance,
  DocSearchEntry,
  getMatchingSlugs,
  normalizeForSearch,
  parseSearchKeyword,
  SearchRelevanceScore,
  sortBySearchRelevance,
  tokenizeSearchKeyword,
  tokensCoveredBy,
} from '.';

function createSearchEntry(
  partial: Partial<DocSearchEntry> & Pick<DocSearchEntry, 'titleText'>,
): DocSearchEntry {
  const titleText = partial.titleText;
  const overviewText = partial.overviewText ?? '';
  const sectionsText = partial.sectionsText ?? '';
  const combinedText =
    partial.combinedText ??
    [titleText, overviewText, sectionsText].filter(Boolean).join(' ');

  return { titleText, overviewText, sectionsText, combinedText };
}

function createScore(
  partial: Partial<SearchRelevanceScore> = {},
): SearchRelevanceScore {
  return {
    priority: 4,
    phraseMatch: false,
    exact: false,
    titleTokenHits: 0,
    overviewTokenHits: 0,
    ...partial,
  };
}

describe('keywordSearch', () => {
  describe('normalizeForSearch', () => {
    it('should lowercase and trim', () => {
      expect(normalizeForSearch('  Mental Health  ')).toBe('mental health');
    });

    it('should collapse whitespace and replace NBSP', () => {
      expect(normalizeForSearch('mental\u00A0\u00A0health')).toBe(
        'mental health',
      );
    });
  });

  describe('tokenizeSearchKeyword', () => {
    it('should dedupe repeated tokens', () => {
      expect(tokenizeSearchKeyword('foo foo')).toEqual(['foo']);
      expect(tokenizeSearchKeyword('the the report')).toEqual([
        'the',
        'report',
      ]);
    });
  });

  describe('parseSearchKeyword', () => {
    it('should return null for empty keyword', () => {
      expect(parseSearchKeyword('')).toBeNull();
    });

    it('should return null for whitespace-only keyword', () => {
      expect(parseSearchKeyword('   ')).toBeNull();
    });
  });

  describe('tokensCoveredBy', () => {
    it('should return true when every token appears in at least one text', () => {
      expect(
        tokensCoveredBy(['foo', 'bar'], ['foo in title', 'bar in overview']),
      ).toBe(true);
    });

    it('should return true if at least one of the tokens is present', () => {
      expect(tokensCoveredBy(['foo', 'bar'], ['foo', 'foo again'])).toBe(true);
    });

    it('should return false if none of tokens are present', () => {
      expect(tokensCoveredBy(['foo', 'bar'], ['token1', 'token2'])).toBe(false);
    });
  });

  describe('getMatchingSlugs', () => {
    it('should return slugs for matching entries', () => {
      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'match',
          createSearchEntry({
            titleText: 'age cymru swansea bay evaluation report',
            sectionsText: 'the money advice service provided support',
          }),
        ],
        [
          'no-match',
          createSearchEntry({
            titleText: 'unrelated document',
          }),
        ],
      ]);

      const slugs = getMatchingSlugs(
        'Age Cymru Swansea Bay Money Advice Service Evaluation report',
        searchBySlug,
      );

      expect(slugs).toEqual(new Set(['match']));
    });

    it('should return slugs for matching tokens', () => {
      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'match',
          createSearchEntry({
            titleText: 'Certificate in Money Advice Practice',
            sectionsText:
              'A comprehensive programme that will provide training to Supervisor level',
          }),
        ],
      ]);

      const slugs = getMatchingSlugs('comprehensive training', searchBySlug);

      expect(slugs).toEqual(new Set(['match']));
    });

    it('should return empty set for whitespace-only keyword', () => {
      const searchBySlug = new Map<string, DocSearchEntry>([
        ['match', createSearchEntry({ titleText: 'debt advice guide' })],
      ]);

      expect(getMatchingSlugs('   ', searchBySlug)).toEqual(new Set());
    });
  });

  describe('compareSearchRelevance', () => {
    it('should sort lower priority before higher priority', () => {
      const higherRank = createScore({ priority: 1 });
      const lowerRank = createScore({ priority: 2 });

      expect(compareSearchRelevance(higherRank, lowerRank, 0, 0)).toBeLessThan(
        0,
      );
    });

    it('should prefer phrase match when priority is equal', () => {
      const phraseMatch = createScore({ priority: 2, phraseMatch: true });
      const tokenOnly = createScore({ priority: 2, phraseMatch: false });

      expect(compareSearchRelevance(phraseMatch, tokenOnly, 0, 0)).toBeLessThan(
        0,
      );
    });

    it('should prefer more title token hits when priority and phrase match are equal', () => {
      const moreTitleHits = createScore({
        priority: 2,
        phraseMatch: false,
        titleTokenHits: 2,
      });
      const fewerTitleHits = createScore({
        priority: 2,
        phraseMatch: false,
        titleTokenHits: 1,
      });

      expect(
        compareSearchRelevance(moreTitleHits, fewerTitleHits, 0, 0),
      ).toBeLessThan(0);
    });

    it('should prefer exact match when priority and hit counts are equal', () => {
      const exact = createScore({
        priority: 2,
        phraseMatch: false,
        titleTokenHits: 1,
        exact: true,
      });
      const inexact = createScore({
        priority: 2,
        phraseMatch: false,
        titleTokenHits: 1,
        exact: false,
      });

      expect(compareSearchRelevance(exact, inexact, 0, 0)).toBeLessThan(0);
    });

    it('should prefer newer publish date when all score fields are equal', () => {
      const tiedScore = createScore({ priority: 2, phraseMatch: false });

      expect(
        compareSearchRelevance(tiedScore, tiedScore, 100, 200),
      ).toBeGreaterThan(0);
    });

    it('should prefer title A-Z when scores and dates are equal', () => {
      const tiedScore = createScore({ priority: 2, phraseMatch: false });

      expect(
        compareSearchRelevance(
          tiedScore,
          tiedScore,
          100,
          100,
          'Zebra',
          'Alpha',
        ),
      ).toBeGreaterThan(0);
      expect(
        compareSearchRelevance(
          tiedScore,
          tiedScore,
          100,
          100,
          'Alpha',
          'Zebra',
        ),
      ).toBeLessThan(0);
    });
  });

  describe('sortBySearchRelevance', () => {
    it('should rank phrase-in-title matches above token-scattered matches', () => {
      type TestItem = { id: string; publishDate: string };

      const items: TestItem[] = [
        { id: 'scattered-tokens', publishDate: '2024-01-01T00:00:00Z' },
        { id: 'phrase-in-title', publishDate: '2024-01-01T00:00:00Z' },
      ];

      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'scattered-tokens',
          createSearchEntry({
            titleText: 'mental health overview',
            overviewText: 'content about debt management',
          }),
        ],
        [
          'phrase-in-title',
          createSearchEntry({
            titleText: 'mental health debt report',
          }),
        ],
      ]);

      const sorted = sortBySearchRelevance(
        items,
        'mental health debt',
        (item) => searchBySlug.get(item.id),
        (item) => new Date(item.publishDate).getTime(),
      );

      expect(sorted.map((item) => item.id)).toEqual([
        'phrase-in-title',
        'scattered-tokens',
      ]);
    });

    it('should rank token-in-overview matches above token-scattered matches', () => {
      type TestItem = { id: string; publishDate: string };

      const items: TestItem[] = [
        { id: 'scattered-tokens', publishDate: '2024-01-01T00:00:00Z' },
        { id: 'token-in-overview', publishDate: '2024-01-01T00:00:00Z' },
      ];

      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'scattered-tokens',
          createSearchEntry({
            titleText: 'mental health overview',
            overviewText: 'content about debt management',
          }),
        ],
        [
          'token-in-overview',
          createSearchEntry({
            titleText: 'about management',
          }),
        ],
      ]);

      const sorted = sortBySearchRelevance(
        items,
        'about management',
        (item) => searchBySlug.get(item.id),
        (item) => new Date(item.publishDate).getTime(),
      );

      expect(sorted.map((item) => item.id)).toEqual([
        'token-in-overview',
        'scattered-tokens',
      ]);
    });

    it('should rank phrase-in-sections matches above token-scattered matches', () => {
      type TestItem = { id: string; publishDate: string };

      const items: TestItem[] = [
        { id: 'scattered-tokens', publishDate: '2024-01-01T00:00:00Z' },
        { id: 'phrase-in-sections', publishDate: '2024-01-01T00:00:00Z' },
      ];

      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'scattered-tokens',
          createSearchEntry({
            titleText: 'mental health overview',
            overviewText: 'content about debt management',
            sectionsText: 'some other text in the sections',
          }),
        ],
        [
          'phrase-in-sections',
          createSearchEntry({
            titleText: 'Some title',
            sectionsText: 'description about debt management and mental health',
          }),
        ],
      ]);

      const sorted = sortBySearchRelevance(
        items,
        'description about',
        (item) => searchBySlug.get(item.id),
        (item) => new Date(item.publishDate).getTime(),
      );

      expect(sorted.map((item) => item.id)).toEqual([
        'phrase-in-sections',
        'scattered-tokens',
      ]);
    });

    it('should rank tokens-in-sections if no other match', () => {
      type TestItem = { id: string; publishDate: string };

      const items: TestItem[] = [
        { id: 'scattered-tokens', publishDate: '2024-01-01T00:00:00Z' },
        { id: 'no-tokens-text', publishDate: '2024-01-01T00:00:00Z' },
      ];

      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'scattered-tokens',
          createSearchEntry({
            titleText: 'mental health overview',
            overviewText: 'overview text',
            sectionsText: 'content about debt management',
          }),
        ],
        [
          'no-tokens-text',
          createSearchEntry({
            titleText: 'Some title',
            sectionsText: 'some text',
          }),
        ],
      ]);

      const sorted = sortBySearchRelevance(
        items,
        'money management',
        (item) => searchBySlug.get(item.id),
        (item) => new Date(item.publishDate).getTime(),
      );

      expect(sorted.map((item) => item.id)).toEqual([
        'scattered-tokens',
        'no-tokens-text',
      ]);
    });

    it('should return items unchanged when keyword is empty', () => {
      const items = [{ id: 'a' }, { id: 'b' }];

      expect(
        sortBySearchRelevance(
          items,
          '   ',
          () => undefined,
          () => 0,
        ),
      ).toBe(items);
    });
    it('prefers the newer document when two entries tie on every score field', () => {
      type TestItem = { id: string; publishDate: string };

      const items: TestItem[] = [
        { id: 'older', publishDate: '2018-05-01T00:00:00Z' },
        { id: 'newer', publishDate: '2018-10-31T00:00:00Z' },
      ];

      const searchBySlug = new Map<string, DocSearchEntry>([
        [
          'older',
          createSearchEntry({
            titleText: 'induction programme',
            sectionsText: 'covers secured lending modules',
          }),
        ],
        [
          'newer',
          createSearchEntry({
            titleText: 'induction programme',
            sectionsText: 'covers secured lending modules',
          }),
        ],
      ]);

      const sorted = sortBySearchRelevance(
        items,
        'secured',
        (item) => searchBySlug.get(item.id),
        (item) => new Date(item.publishDate).getTime(),
      );

      expect(sorted.map((item) => item.id)).toEqual(['newer', 'older']);
    });

    it('should ranks a title match above an overview-only match above a body-only match', () => {
      type TestItem = { id: string; publishDate: string };

      const items: TestItem[] = [
        { id: 'body-only', publishDate: '2024-01-01T00:00:00Z' },
        { id: 'overview-only', publishDate: '2024-01-01T00:00:00Z' },
        { id: 'title-match', publishDate: '2024-01-01T00:00:00Z' },
      ];

      const searchBySlug = new Map<string, DocSearchEntry>([
        ['title-match', createSearchEntry({ titleText: 'supervision skills' })],
        [
          'overview-only',
          createSearchEntry({
            titleText: 'unrelated title',
            overviewText: 'covers supervision skills',
          }),
        ],
        [
          'body-only',
          createSearchEntry({
            titleText: 'another title',
            sectionsText: 'covers supervision skills',
          }),
        ],
      ]);

      const sorted = sortBySearchRelevance(
        items,
        'skills',
        (item) => searchBySlug.get(item.id),
        (item) => new Date(item.publishDate).getTime(),
      );

      expect(sorted.map((item) => item.id)).toEqual([
        'title-match',
        'overview-only',
        'body-only',
      ]);
    });
  });
});
