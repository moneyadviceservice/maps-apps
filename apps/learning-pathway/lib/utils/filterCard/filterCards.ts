import {
  DetailsPagesListModel,
  QueryParams,
  TagModel,
} from 'lib/types/site.type';

import {
  getMatchingSlugs,
  sortBySearchRelevance,
} from '@maps-react/mps/utils/search';

import { prepareSearchData } from '../search/search';
import sortCards, { SortOrder } from '../sortCards/sortCards';

/**
 *
 * @param query all query params
 * @param tags the list of configured tags
 * @returns only the query params that are related to the tags
 */
export const validateTags = (
  query: QueryParams,
  tags: TagModel[] | null,
): QueryParams => {
  if (!query || !tags) return {};

  return Object.entries(query).reduce<QueryParams>((acc, [key, value]) => {
    const isValidTag = tags.some((t) => t.tagCategory.categoryKey === key);
    if (!isValidTag || value == null) return acc;

    acc[key] = Array.isArray(value)
      ? value
      : value.split(',').map((v) => v.trim());

    return acc;
  }, {});
};

/**
 * Fitler cards by fitler and search terms
 * @param cards
 * @param query
 * @param keyword
 * @returns
 */
export const filterAndSearchCards = (
  cards: DetailsPagesListModel[] | [],
  query: QueryParams,
  keyword: string | undefined,
  sortByDateLaunched = false,
): DetailsPagesListModel[] => {
  if (!cards) return [];
  if (Object.keys(query).length === 0 && !keyword) return cards;
  const matchedSlugs = keyword
    ? getMatchingSlugs(keyword, prepareSearchData(cards))
    : null;

  const matchedCards: DetailsPagesListModel[] = matchedSlugs
    ? cards.filter((t) => matchedSlugs?.has(t.slug))
    : cards;

  const filteredCards: DetailsPagesListModel[] = [];
  /** filter cards by checked filters and return only the cards with the relevant tags */
  for (const card of matchedCards) {
    const matches = Object.entries(query).every(([key, value]) => {
      const selectedValues = Array.isArray(value)
        ? value
        : value?.split(',').map((v) => v.trim());

      return card.pageTags.some(
        (tag) =>
          tag.tagCategory.categoryKey === key &&
          selectedValues?.includes(tag.value),
      );
    });

    const matchesKeyword = !keyword || matchedSlugs?.has(card.slug);
    if (matches && matchesKeyword) filteredCards.push(card);
  }
  return filteredCards;
};

/**
 * Sort cards by sort term or relevance if there is a search term present and no other sort option is selected
 * @param cards
 * @param keyword
 * @param order
 * @param seed
 * @returns
 */
export const sortByCards = (
  cards: DetailsPagesListModel[] | [],
  keyword: string | undefined,
  order: SortOrder,
  seed: number,
) => {
  if (!cards) return [];

  /** return the results ordered by search term relevance */
  if (keyword && (order === 'relevance' || !order)) {
    return sortBySearchRelevance<DetailsPagesListModel>(
      cards,
      keyword,
      (item: DetailsPagesListModel) =>
        item.slug ? prepareSearchData(cards).get(item.slug) : undefined,
      (item: DetailsPagesListModel) =>
        item.dateLaunched ? new Date(item.dateLaunched).getTime() : 0,
      (item: DetailsPagesListModel) => item.pageTitle,
    );
  } else {
    /** return the cards sorted based on the selected order */
    return sortCards(cards, order, seed);
  }
};

/**
 *
 * @param tags
 * @param paramTags
 * @returns returns the list of tags updating the cheked property
 */
export const setCheckedFilter = (
  tags: TagModel[] | null,
  paramTags: QueryParams | null,
): TagModel[] => {
  if (!tags) return [];
  return tags?.map((tag) => {
    const categoryKey = tag?.tagCategory?.categoryKey;
    const isChecked = Object.entries(paramTags ?? {}).some(
      ([key, value]) => key === categoryKey && value?.includes(tag.value),
    );
    return { ...tag, isChecked: !!isChecked };
  });
};
