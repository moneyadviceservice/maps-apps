import { NextRouter } from 'next/router';

import { stringify } from 'query-string';
import slug from 'slug';

import {
  listAccountAccess,
  listAccountFeatures,
  listAccountTypes,
} from './accountMapping';

interface QueryObject {
  [key: string]: string | string[] | undefined;
}

interface QueryBuilder {
  withParameter: (name: string, value: string | number) => QueryBuilder;
  withoutParameter: (name: string) => QueryBuilder;
  resetPage: () => QueryBuilder;
  toString: () => string;
}

interface PageFilters {
  count: number;
  page: number;
  searchQuery: string;
  order: string;
  accountsPerPage: number;
  accountTypes: string[];
  accountFeatures: string[];
  accountAccess: string[];
  setOrder: (value: string) => Promise<boolean>;
  setAccountsPerPage: (value: string | number) => Promise<boolean>;
  removeFilterHref: (filter: string) => string;
  removeSearchQueryHref: () => string;
  isFilterActive: (filter: string) => boolean;
  setPageHref: (p: string | number) => string;
  clearFiltersHref: () => string;
}

interface RouterLike {
  query: {
    [key: string]: string | string[] | undefined;
  };
  push?: (
    url: string,
    as?: string,
    options?: { scroll?: boolean },
  ) => Promise<boolean>;
}

const pageFilters = (router: NextRouter | RouterLike): PageFilters => {
  const accountTypes = (): string[] => {
    const types = listAccountTypes();
    return types.filter((t) => !!router.query[slug(t)]);
  };

  const accountFeatures = (): string[] => {
    const features = listAccountFeatures();
    return features.filter((f) => !!router.query[slug(f)]);
  };

  const accountAccess = (): string[] => {
    const access = listAccountAccess();
    return access.filter((a) => !!router.query[slug(a)]);
  };

  const searchQuery = (): string => {
    return (router.query.q as string) || '';
  };

  const count = (): number => {
    let result = 0;

    if (searchQuery()) {
      result++;
    }
    result += accountTypes().length;
    result += accountFeatures().length;
    result += accountAccess().length;

    return result;
  };

  const Query = (query?: QueryObject): QueryBuilder => {
    const queryObj = query || { ...router.query };

    const withParameter = (
      name: string,
      value: string | number,
    ): QueryBuilder => {
      queryObj[name] = String(value);
      return Query(queryObj);
    };

    const withoutParameter = (name: string): QueryBuilder => {
      delete queryObj[name];
      return Query(queryObj);
    };

    const resetPage = (): QueryBuilder => {
      queryObj.p = '1';
      return Query(queryObj);
    };

    const toString = (): string => {
      return '?' + stringify(queryObj);
    };

    return {
      withParameter,
      withoutParameter,
      resetPage,
      toString,
    };
  };

  const navigateWithoutScrolling = (url: string): Promise<boolean> =>
    router.push
      ? router.push(url, undefined, { scroll: false })
      : Promise.resolve(true);

  return {
    count: count(),
    page: router.query.p ? parseInt(router.query.p as string) : 1,
    searchQuery: searchQuery(),
    order: (router.query.order as string) || 'random',
    accountsPerPage: router.query.accountsPerPage
      ? Number(router.query.accountsPerPage)
      : 5,
    accountTypes: accountTypes(),
    accountFeatures: accountFeatures(),
    accountAccess: accountAccess(),
    setOrder: (value: string) =>
      navigateWithoutScrolling(
        Query().withParameter('order', value).resetPage().toString(),
      ),
    setAccountsPerPage: (value: string | number) =>
      navigateWithoutScrolling(
        Query().withParameter('accountsPerPage', value).resetPage().toString(),
      ),
    removeFilterHref: (filter: string) =>
      Query().withoutParameter(slug(filter)).resetPage().toString(),
    removeSearchQueryHref: () =>
      Query().withoutParameter('q').resetPage().toString(),
    isFilterActive: (filter: string) => {
      const activeFilters = [
        ...accountTypes(),
        ...accountFeatures(),
        ...accountAccess(),
      ];
      return activeFilters.includes(filter);
    },
    setPageHref: (p: string | number) =>
      Query().withParameter('p', p).toString(),
    clearFiltersHref: () => {
      let q = Query();

      accountTypes().forEach((v) => (q = q.withoutParameter(slug(v))));
      accountFeatures().forEach((v) => (q = q.withoutParameter(slug(v))));
      accountAccess().forEach((v) => (q = q.withoutParameter(slug(v))));
      q = q.withoutParameter('p');
      q = q.withoutParameter('q');
      q = q.withoutParameter('order');

      return q.toString();
    },
  };
};

export default pageFilters;
