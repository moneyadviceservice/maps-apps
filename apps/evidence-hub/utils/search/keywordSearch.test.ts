import {
  compareSearchRelevance,
  type DocSearchEntry,
  documentMatchesKeyword,
  getMatchingSlugs,
  normalizeForSearch,
  parseSearchKeyword,
  scoreSearchRelevance,
  type SearchRelevanceScore,
  sortBySearchRelevance,
  tokenizeSearchKeyword,
  tokensCoveredBy,
} from './keywordSearch';

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

function requireParsed(keyword: string) {
  const parsed = parseSearchKeyword(keyword);
  if (!parsed) {
    throw new Error(
      `Expected parseSearchKeyword("${keyword}") to return a value`,
    );
  }
  return parsed;
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

    it('should return false when a token is missing', () => {
      expect(tokensCoveredBy(['foo', 'bar'], ['foo', 'foo again'])).toBe(false);
    });

    it('should not treat duplicate field hits as full coverage', () => {
      expect(tokensCoveredBy(['foo', 'bar'], ['foo', 'foo'])).toBe(false);
    });
  });

  describe('documentMatchesKeyword', () => {
    it('should match a single word in combined text', () => {
      const entry = createSearchEntry({
        titleText: 'debt advice guide',
      });

      expect(documentMatchesKeyword(entry, 'debt')).toBe(true);
    });

    it('should match when all query words appear across fields', () => {
      const entry = createSearchEntry({
        titleText: 'age cymru swansea bay evaluation report',
        overviewText: 'an evaluation of local services',
        sectionsText: 'the money advice service provided support',
      });

      expect(
        documentMatchesKeyword(
          entry,
          'age cymru swansea bay money advice service evaluation report',
        ),
      ).toBe(true);
    });

    it('should match when words are split across title and overview', () => {
      const entry = createSearchEntry({
        titleText: 'debt advice guide',
        overviewText: 'this report covers mental health topics',
      });

      expect(documentMatchesKeyword(entry, 'mental health debt')).toBe(true);
    });

    it('should not match when only a subset of query words are present', () => {
      const entry = createSearchEntry({
        titleText: 'money matters',
        overviewText: 'financial guidance',
        sectionsText: 'general financial content',
      });

      expect(documentMatchesKeyword(entry, 'money advice')).toBe(false);
    });

    it('should match exact phrase in combined text', () => {
      const entry = createSearchEntry({
        titleText: 'mental health report',
      });

      expect(documentMatchesKeyword(entry, 'mental health')).toBe(true);
    });

    it('should handle special regex characters in keyword', () => {
      const entry = createSearchEntry({
        titleText: 'report on (special) topics',
      });

      expect(documentMatchesKeyword(entry, '(special)')).toBe(true);
    });

    it('should accept a pre-parsed keyword', () => {
      const entry = createSearchEntry({
        titleText: 'debt advice guide',
        overviewText: 'this report covers mental health topics',
      });
      const parsed = requireParsed('mental health debt');

      expect(documentMatchesKeyword(entry, parsed)).toBe(true);
    });

    it('should return false for empty keyword', () => {
      const entry = createSearchEntry({ titleText: 'debt advice guide' });

      expect(documentMatchesKeyword(entry, '')).toBe(false);
    });

    it('should return false for whitespace-only keyword', () => {
      const entry = createSearchEntry({ titleText: 'debt advice guide' });

      expect(documentMatchesKeyword(entry, '   ')).toBe(false);
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

    it('should return empty set for whitespace-only keyword', () => {
      const searchBySlug = new Map<string, DocSearchEntry>([
        ['match', createSearchEntry({ titleText: 'debt advice guide' })],
      ]);

      expect(getMatchingSlugs('   ', searchBySlug)).toEqual(new Set());
    });
  });

  describe('scoreSearchRelevance', () => {
    it('should score title phrase match as priority 1', () => {
      const entry = createSearchEntry({
        titleText: 'mental health debt report',
      });

      expect(scoreSearchRelevance(entry, 'mental health debt')).toEqual(
        expect.objectContaining({ priority: 1, phraseMatch: true }),
      );
    });

    it('should score scattered token match lower than phrase in title', () => {
      const scattered = createSearchEntry({
        titleText: 'mental health overview',
        overviewText: 'content about debt management',
      });
      const phrase = createSearchEntry({
        titleText: 'mental health debt report',
      });

      const scatteredScore = scoreSearchRelevance(
        scattered,
        'mental health debt',
      );
      const phraseScore = scoreSearchRelevance(phrase, 'mental health debt');

      expect(scatteredScore).toEqual(
        expect.objectContaining({ priority: 2, phraseMatch: false }),
      );
      expect(phraseScore).toEqual(
        expect.objectContaining({ priority: 1, phraseMatch: true }),
      );
      expect(phraseScore.priority).toBeLessThan(scatteredScore.priority);
    });

    it('should set exact true for word-boundary phrase match in title', () => {
      const entry = createSearchEntry({ titleText: 'debt advice' });

      expect(scoreSearchRelevance(entry, 'debt')).toEqual(
        expect.objectContaining({
          priority: 1,
          phraseMatch: true,
          exact: true,
        }),
      );
    });

    it('should set exact false when phrase is only a substring without word boundary', () => {
      const entry = createSearchEntry({ titleText: 'debtor advice' });

      expect(scoreSearchRelevance(entry, 'debt')).toEqual(
        expect.objectContaining({
          priority: 1,
          phraseMatch: true,
          exact: false,
        }),
      );
    });

    it('should accept a pre-parsed keyword with the same result as a raw string', () => {
      const entry = createSearchEntry({
        titleText: 'mental health overview',
        overviewText: 'content about debt management',
      });
      const parsed = requireParsed('mental health debt');

      expect(scoreSearchRelevance(entry, parsed)).toEqual(
        scoreSearchRelevance(entry, 'mental health debt'),
      );
    });

    it('should return priority 4 for missing entry', () => {
      expect(scoreSearchRelevance(undefined, 'test')).toEqual(
        expect.objectContaining({ priority: 4 }),
      );
    });

    it('should return priority 4 for empty keyword', () => {
      const entry = createSearchEntry({ titleText: 'debt advice' });

      expect(scoreSearchRelevance(entry, '')).toEqual({
        priority: 4,
        phraseMatch: false,
        exact: false,
        titleTokenHits: 0,
        overviewTokenHits: 0,
      });
    });

    it('should not assign priority 2 when summed hits inflate coverage', () => {
      const entry = createSearchEntry({
        titleText: 'foo',
        overviewText: 'foo',
      });

      expect(scoreSearchRelevance(entry, 'foo bar')).toEqual(
        expect.objectContaining({ priority: 4 }),
      );
    });

    it('should not assign priority 3 when summed hits inflate coverage across sections', () => {
      const entry = createSearchEntry({
        titleText: 'foo',
        overviewText: 'foo',
        sectionsText: 'more foo content',
      });

      expect(scoreSearchRelevance(entry, 'foo bar')).toEqual(
        expect.objectContaining({ priority: 4 }),
      );
    });

    it('should score deduped duplicate query tokens as a single token match in title', () => {
      const entry = createSearchEntry({
        titleText: 'foo',
      });

      expect(scoreSearchRelevance(entry, 'foo foo')).toEqual(
        expect.objectContaining({ priority: 1, phraseMatch: false }),
      );
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
  });
});
