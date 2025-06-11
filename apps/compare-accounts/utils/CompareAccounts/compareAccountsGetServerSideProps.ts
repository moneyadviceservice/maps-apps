import cacheData from 'memory-cache';
import calculatePagination from 'utils/CompareAccounts/calculatePagination';
import findAccounts from 'utils/CompareAccounts/findAccounts';
import hydrateAccountsFromJson from 'utils/CompareAccounts/hydrateAccountsFromJson';

import pageFilters from '../../utils/CompareAccounts/pageFilters';

const compareAccountsGetServerSideProps = async (context: any) => {
  const fetchWithCache = async (url = '') => {
    const cachedData = cacheData.get(url);
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
    cacheData.put(url, { data, timestamp });
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
