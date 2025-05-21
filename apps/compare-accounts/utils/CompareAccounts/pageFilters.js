import queryString from 'query-string';
import slug from 'slug';

import {
  listAccountAccess,
  listAccountFeatures,
  listAccountTypes,
} from './account-mapping';

const pageFilters = (router) => {
  const accountTypes = () => {
    const types = listAccountTypes();
    return types.filter((t) => !!router.query[slug(t)]);
  };

  const accountFeatures = () => {
    const features = listAccountFeatures();
    return features.filter((f) => !!router.query[slug(f)]);
  };

  const accountAccess = () => {
    const access = listAccountAccess();
    return access.filter((a) => !!router.query[slug(a)]);
  };

  const searchQuery = () => {
    return router.query.q || '';
  };

  const count = () => {
    let result = 0;

    if (searchQuery()) {
      result++;
    }
    result += accountTypes().length;
    result += accountFeatures().length;
    result += accountAccess().length;

    return result;
  };

  const Query = (query) => {
    query = query || { ...router.query };

    const withParameter = (name, value) => {
      query[name] = value;
      return Query(query);
    };

    const withoutParameter = (name) => {
      delete query[name];
      return Query(query);
    };

    const resetPage = () => {
      query.p = 1;
      return Query(query);
    };

    const toString = () => {
      return '?' + queryString.stringify(query);
    };

    return {
      withParameter,
      withoutParameter,
      resetPage,
      toString,
    };
  };

  const navigateWithoutScrolling = (url) =>
    router.push(url, undefined, { scroll: false });

  return {
    count: count(),
    page: router.query.p ? parseInt(router.query.p) : 1,
    searchQuery: searchQuery(),
    order: router.query.order || 'random',
    accountsPerPage: router.query.accountsPerPage
      ? Number(router.query.accountsPerPage)
      : 5,
    accountTypes: accountTypes(),
    accountFeatures: accountFeatures(),
    accountAccess: accountAccess(),
    setOrder: (value) =>
      navigateWithoutScrolling(
        Query().withParameter('order', value).resetPage().toString(),
      ),
    setAccountsPerPage: (value) =>
      navigateWithoutScrolling(
        Query().withParameter('accountsPerPage', value).resetPage().toString(),
      ),
    removeFilterHref: (filter) =>
      Query().withoutParameter(slug(filter)).resetPage().toString(),
    removeSearchQueryHref: () =>
      Query().withoutParameter('q').resetPage().toString(),
    isFilterActive: (filter) => {
      const activeFilters = [
        ...accountTypes(),
        ...accountFeatures(),
        ...accountAccess(),
      ];
      return activeFilters.includes(filter);
    },
    setPageHref: (p) => Query().withParameter('p', p).toString(),
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
