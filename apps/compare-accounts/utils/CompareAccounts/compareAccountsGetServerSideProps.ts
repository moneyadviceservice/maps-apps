import { get, put } from 'memory-cache';

import calculatePagination from './calculatePagination';
import findAccounts from './findAccounts';
import hydrateAccountsFromJson from './hydrateAccountsFromJson';
import pageFilters from './pageFilters';

interface ServerSideContext {
  query: {
    [key: string]: string | string[] | undefined;
  };
}

const compareAccountsGetServerSideProps = async (
  context: ServerSideContext,
) => {
  const fetchWithCache = async (url = '') => {
    const cachedData = get(url);
    if (cachedData) {
      const currentTime = new Date().getTime();
      const { data, timestamp } = cachedData;
      const expiration = timestamp + 6 * 60 * 60 * 1000;
      const timeLeft = expiration - currentTime;

      if (timeLeft > 0) {
        return data;
      }
    }

    const response = await fetch(url);
    const data = await response.json();
    const timestamp = new Date().getTime();
    put(url, { data, timestamp });
    return data;
  };

  const jsonAccounts = await fetchWithCache(process.env.ACCOUNTS_API);
  const allAccounts = hydrateAccountsFromJson(jsonAccounts);

  const filters = pageFilters(context);
  const accounts = findAccounts(allAccounts, filters);

  const pagination = calculatePagination({
    page: filters.page,
    pageSize: filters.accountsPerPage,
    totalItems: accounts.length,
  });

  const { 'jcr:lastModified': lastUpdated } = await jsonAccounts;

  return {
    props: {
      accounts: accounts.slice(pagination.startIndex, pagination.endIndex),
      totalItems: pagination.totalItems,
      lastUpdated: lastUpdated,
      isEmbed: !!context.query?.isEmbedded,
    },
  };
};
export default compareAccountsGetServerSideProps;
