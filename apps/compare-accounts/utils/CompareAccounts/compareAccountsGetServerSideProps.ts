import type { GetServerSidePropsContext } from 'next';

import calculatePagination from './calculatePagination';
import findAccounts from './findAccounts';
import hydrateAccountsFromJson from './hydrateAccountsFromJson';
import pageFilters from './pageFilters';

const compareAccountsGetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  // Build a full URL rather than a relative path so the request goes through
  // the CDN, which caches the /api/accounts response.
  const proto = (context.req.headers['x-forwarded-proto'] as string) || 'http';
  const host = context.req.headers.host || 'localhost';
  const apiUrl = `${proto}://${host}/api/accounts`;
  const apiRes = await fetch(apiUrl);

  if (!apiRes.ok) {
    throw new Error(`Failed to fetch /api/accounts: ${apiRes.status}`);
  }

  const { lastModified, items } = await apiRes.json();
  const allAccounts = hydrateAccountsFromJson({ items });

  const filters = pageFilters(context);
  const accounts = findAccounts(allAccounts, filters);

  const pagination = calculatePagination({
    page: filters.page,
    pageSize: filters.accountsPerPage,
    totalItems: accounts.length,
  });

  return {
    props: {
      accounts: accounts.slice(pagination.startIndex, pagination.endIndex),
      lastModified,
      totalItems: pagination.totalItems,
      isEmbed: !!context.query?.isEmbedded,
    },
  };
};
export default compareAccountsGetServerSideProps;
