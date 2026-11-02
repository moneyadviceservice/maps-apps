import { mockQueryParams } from 'lib/mocks/mockURLParams';
import {
  validateTags,
  setCheckedFilter,
  filterAndSearchCards,
  sortByCards,
} from './filterCards';
import { mockTags } from 'lib/mocks/mockTags';
import { mockPageDetails } from 'lib/mocks/mockPageDetails';

describe('getPaginated', () => {
  describe('validateTags', () => {
    it('should return query params that match the fitlers', () => {
      const result = validateTags(mockQueryParams['scenario-1'], mockTags);
      expect(Object.keys(result)).toHaveLength(2);

      expect(result).toEqual({
        'category-1': ['cat-1-filter-1'],
        'category-2': ['cat-2-filter-1', 'cat-2-filter-2'],
      });
    });

    it('should return empty object if query is empty', () => {
      const result = validateTags({}, mockTags);
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('should return empty object if tags are empty', () => {
      const result = validateTags(mockQueryParams['scenario-1'], null);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('setCheckedFilter', () => {
    it('should mark tags as checked when they match the param values', () => {
      const result = setCheckedFilter(mockTags, mockQueryParams['scenario-1']);
      expect(result?.find((t) => t.value === 'cat-1-filter-1')?.isChecked).toBe(
        true,
      );
      expect(result?.find((t) => t.value === 'cat-2-filter-1')?.isChecked).toBe(
        true,
      );
      expect(result?.find((t) => t.value === 'cat-2-filter-2')?.isChecked).toBe(
        true,
      );
    });

    it('should mark tags as unchecked when they do not match the param values', () => {
      const result = setCheckedFilter(mockTags, mockQueryParams['scenario-1']);
      expect(result?.find((t) => t.value === 'cat-1-filter-2')?.isChecked).toBe(
        false,
      );
      expect(result?.find((t) => t.value === 'cat-1-filter-3')?.isChecked).toBe(
        false,
      );
    });

    it('should return all tags as unchecked when paramTags is empty', () => {
      const result = setCheckedFilter(mockTags, {});
      expect(result?.every((t) => t.isChecked === false)).toBe(true);
    });

    it('should return all tags as unchecked when paramTags is null', () => {
      const result = setCheckedFilter(mockTags, null);
      expect(result?.every((t) => t.isChecked === false)).toBe(true);
    });

    it('should return undefined when tags is null', () => {
      const result = setCheckedFilter(null, mockQueryParams['scenario-1']);
      expect(result).toHaveLength(0);
    });
  });

  describe('filterAndSearchCards', () => {
    const cards = mockPageDetails.items as Parameters<
      typeof filterAndSearchCards
    >[0];

    it('should return all cards when query is empty and no keyword', () => {
      const result = filterAndSearchCards(cards, {}, undefined);
      expect(result).toHaveLength(cards.length);
    });

    it('should return empty array when cards is empty', () => {
      const result = filterAndSearchCards(
        [],
        { 'category-1': ['cat-1-filter-1'] },
        undefined,
      );
      expect(result).toHaveLength(0);
    });

    it('should filter cards by a single tag filter', () => {
      const result = filterAndSearchCards(
        cards,
        { 'category-1': ['cat-1-filter-1'] },
        undefined,
      );
      expect(
        result.every((c) =>
          c.pageTags.some(
            (t) =>
              t.tagCategory.categoryKey === 'category-1' &&
              t.value === 'cat-1-filter-1',
          ),
        ),
      ).toBe(true);
    });

    it('should filter cards by multiple tag categories (AND logic)', () => {
      const query = {
        'category-1': ['cat-1-filter-1'],
        'category-2': ['cat-2-filter-1'],
      };
      const result = filterAndSearchCards(cards, query, undefined);
      for (const card of result) {
        expect(
          card.pageTags.some(
            (t) =>
              t.tagCategory.categoryKey === 'category-1' &&
              t.value === 'cat-1-filter-1',
          ),
        ).toBe(true);
        expect(
          card.pageTags.some(
            (t) =>
              t.tagCategory.categoryKey === 'category-2' &&
              t.value === 'cat-2-filter-1',
          ),
        ).toBe(true);
      }
    });

    it('should return no cards when filter matches no cards', () => {
      const result = filterAndSearchCards(
        cards,
        { 'category-1': ['nonexistent-value'] },
        undefined,
      );
      expect(result).toHaveLength(0);
    });

    it('should filter by keyword and return only matching cards', () => {
      const firstCard = cards[0];
      const keyword = firstCard.pageTitle.split(' ')[0];
      const result = filterAndSearchCards(cards, {}, keyword);
      expect(result.some((c) => c.slug === firstCard.slug)).toBe(true);
    });

    it('should apply both keyword and tag filters together', () => {
      const query = { 'category-1': ['cat-1-filter-1'] };
      const keyword = 'Debt';
      const result = filterAndSearchCards(cards, query, keyword);
      for (const card of result) {
        expect(
          card.pageTags.some(
            (t) =>
              t.tagCategory.categoryKey === 'category-1' &&
              t.value === 'cat-1-filter-1',
          ),
        ).toBe(true);
      }
    });

    it('should return no cards when keyword matches nothing', () => {
      const result = filterAndSearchCards(cards, {}, 'zzznomatch999');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortByCards', () => {
    const cards = mockPageDetails.items as Parameters<typeof sortByCards>[0];

    it('should return empty array when cards is empty', () => {
      expect(sortByCards([], undefined, 'titleAZ', 0)).toHaveLength(0);
    });

    it('should sort cards by title A-Z', () => {
      const result = sortByCards(cards, undefined, 'titleAZ', 0);
      const titles = result.map((c) => c.pageTitle);
      expect(titles).toEqual(
        [...titles].sort((a, b) =>
          a.localeCompare(b, 'en', { sensitivity: 'base' }),
        ),
      );
    });

    it('should sort cards by title Z-A', () => {
      const result = sortByCards(cards, undefined, 'titleZA', 0);
      const titles = result.map((c) => c.pageTitle);
      expect(titles).toEqual(
        [...titles].sort((a, b) =>
          b.localeCompare(a, 'en', { sensitivity: 'base' }),
        ),
      );
    });

    it('should sort cards by dateLaunched descending', () => {
      const result = sortByCards(cards, undefined, 'dateLaunched', 0);
      for (let i = 1; i < result.length; i++) {
        expect(
          new Date(result[i - 1].dateLaunched).getTime(),
        ).toBeGreaterThanOrEqual(new Date(result[i].dateLaunched).getTime());
      }
    });

    it('should sort by relevance when keyword is provided and order is relevance', () => {
      const result = sortByCards(cards, 'Debt', 'relevance', 0);
      expect(result).toHaveLength(cards.length);
    });

    it('should sort by relevance when keyword is provided and no order is given', () => {
      const result = sortByCards(cards, 'Debt', undefined as never, 0);
      expect(result).toHaveLength(cards.length);
    });

    it('should use sortCards when keyword is provided but order is not relevance', () => {
      const result = sortByCards(cards, 'Debt', 'titleAZ', 0);
      const titles = result.map((c) => c.pageTitle);
      expect(titles).toEqual(
        [...titles].sort((a, b) =>
          a.localeCompare(b, 'en', { sensitivity: 'base' }),
        ),
      );
    });

    it('should return a shuffled array for random order', () => {
      const result = sortByCards(cards, undefined, 'random', 42);
      expect(result).toHaveLength(cards.length);
    });
  });
});
