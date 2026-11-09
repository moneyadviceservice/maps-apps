import { DetailsPagesListModel } from 'lib/types/site.type';

import { DEFAULT_SORT_ORDER, getSortOrder, sortCards } from './sortCards';

const makeCard = (
  overrides: Partial<DetailsPagesListModel>,
): DetailsPagesListModel => ({
  slug: 'slug',
  pageTitle: 'Title',
  overview: { json: [] },
  pageTags: [],
  owner: 'Owner',
  dateLaunched: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

const cards: DetailsPagesListModel[] = [
  makeCard({
    slug: 'b',
    pageTitle: 'Banana',
    dateLaunched: '2024-06-01T00:00:00.000Z',
  }),
  makeCard({
    slug: 'a',
    pageTitle: 'Apple',
    dateLaunched: '2025-01-01T00:00:00.000Z',
  }),
  makeCard({
    slug: 'c',
    pageTitle: 'cherry',
    dateLaunched: '2023-01-01T00:00:00.000Z',
  }),
];

const slugs = (list: DetailsPagesListModel[]) => list.map((c) => c.slug);

describe('sortCards', () => {
  it('sorts by relevance', () => {
    expect(slugs(sortCards(cards, 'relevance'))).toEqual(['b', 'a', 'c']);
  });
  it('sorts by title A-Z', () => {
    expect(slugs(sortCards(cards, 'titleAZ'))).toEqual(['a', 'b', 'c']);
  });

  it('sorts by title Z-A', () => {
    expect(slugs(sortCards(cards, 'titleZA'))).toEqual(['c', 'b', 'a']);
  });

  it('sorts by date launched, newest first', () => {
    expect(slugs(sortCards(cards, 'dateLaunched'))).toEqual(['a', 'b', 'c']);
  });

  it('sinks cards with a missing/invalid date to the bottom', () => {
    const withMissing = [
      makeCard({ slug: 'x', dateLaunched: '' }),
      makeCard({ slug: 'y', dateLaunched: '2025-01-01T00:00:00.000Z' }),
    ];
    expect(slugs(sortCards(withMissing, 'dateLaunched'))).toEqual(['y', 'x']);
  });

  it('does not mutate the original array', () => {
    const original = [...cards];
    sortCards(cards, 'titleAZ');
    expect(cards).toEqual(original);
  });

  it('defaults to random when no order is given', () => {
    expect(sortCards(cards)).toEqual(sortCards(cards, DEFAULT_SORT_ORDER));
  });

  it('should return relevance instead of random when there is a search key', () => {
    const orderList = getSortOrder(true);
    expect(orderList).toEqual([
      'relevance',
      'titleAZ',
      'titleZA',
      'dateLaunched',
    ]);
  });

  it('should return random when there is no keyword in query params', () => {
    const orderList = getSortOrder(false);
    expect(orderList).toEqual(['random', 'titleAZ', 'titleZA', 'dateLaunched']);
  });
});
