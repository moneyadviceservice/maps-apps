import { DetailsPagesListModel } from 'lib/types/site.type';

export const SORT_ORDERS = [
  'random',
  'relevance',
  'titleAZ',
  'titleZA',
  'dateLaunched',
] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export const DEFAULT_SORT_ORDER: SortOrder = 'random';
export const RELEVANCE_SORT_ORDER: SortOrder = 'relevance';

export const getSortOrder = (hasKeyword: boolean): readonly SortOrder[] =>
  hasKeyword
    ? SORT_ORDERS.filter((o) => o !== 'random')
    : SORT_ORDERS.filter((o) => o !== 'relevance');

export const isSortOrder = (value: unknown): value is SortOrder =>
  typeof value === 'string' && SORT_ORDERS.includes(value as SortOrder);

const orderByTitle = (cards: DetailsPagesListModel[], reverse = false) =>
  cards
    .slice()
    .sort(
      (a, b) =>
        a.pageTitle.localeCompare(b.pageTitle, 'en', { sensitivity: 'base' }) *
        (reverse ? -1 : 1),
    );

const launchTime = (card: DetailsPagesListModel) => {
  const time = Date.parse(card.dateLaunched);
  return Number.isNaN(time) ? -Infinity : time;
};

const orderByDateLaunched = (cards: DetailsPagesListModel[]) =>
  cards.slice().sort((a, b) => launchTime(b) - launchTime(a));

const random = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const shuffle = (cards: DetailsPagesListModel[], seed: number) => {
  const array = cards.slice();
  let currentSeed = seed;
  let m = array.length;

  while (m) {
    const i = Math.floor(random(currentSeed) * m--);
    [array[m], array[i]] = [array[i], array[m]];
    currentSeed += 1;
  }

  return array;
};

export const sortCards = (
  cards: DetailsPagesListModel[],
  order: SortOrder = DEFAULT_SORT_ORDER,
  seed = 0,
): DetailsPagesListModel[] => {
  switch (order) {
    case 'relevance':
      return cards;
    case 'titleAZ':
      return orderByTitle(cards);
    case 'titleZA':
      return orderByTitle(cards, true);
    case 'dateLaunched':
      return orderByDateLaunched(cards);
    case 'random':
    default:
      return shuffle(cards, seed);
  }
};

export default sortCards;
