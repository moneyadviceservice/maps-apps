import type { GetServerSidePropsContext } from 'next';

import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { paginateItems } from '@maps-react/utils/pagination';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

import { extractSearchFilters } from './filters/pageFilters';
import { searchStations } from './search/searchStations';
import type { StationsData, StationSearchResult } from './types';

export interface FuelFinderPageProps {
  stations: StationSearchResult[];
  totalItems: number;
  fetchedAt: string;
  hasSearched: boolean;
  isEmbed: boolean;
  emergencyBannerContent?: { en: string; cy: string } | null;
}

const fuelFinderGetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { query, req } = context;
  const isEmbed = query.isEmbedded === 'true';
  const filters = extractSearchFilters(query);

  const hasSearched = filters.lat != null && filters.lng != null;

  if (!hasSearched) {
    const language = (context.params?.language as string) ?? 'en';
    return { redirect: { destination: `/${language}`, permanent: false } };
  }

  const appConfig = await getServerSideAppConfig(req);
  const emergencyBannerContent = parseEmergencyBanner(
    appConfig.getValue('emergency-banner'),
  );

  // Build a full URL rather than a relative path so the request goes through
  // the CDN, which caches the /api/fuel-stations response.
  const proto = (context.req.headers['x-forwarded-proto'] as string) || 'http';
  const host = context.req.headers.host || 'localhost';
  const apiUrl = `${proto}://${host}/api/fuel-stations`;
  const apiRes = await fetch(apiUrl);

  if (!apiRes.ok) {
    throw new Error(`Failed to fetch /api/fuel-stations: ${apiRes.status}`);
  }

  const stationsData: StationsData = await apiRes.json();
  const { stations: allStations, fetchedAt } = stationsData;
  const searchResult = searchStations(allStations, filters, fetchedAt);

  const { items, pagination } = paginateItems(searchResult.stations, {
    page: filters.page,
    limit: filters.perPage,
  });

  return {
    props: {
      stations: items,
      totalItems: pagination.totalItems,
      fetchedAt: searchResult.fetchedAt,
      hasSearched: true,
      isEmbed,
      emergencyBannerContent,
    } as FuelFinderPageProps,
  };
};

export default fuelFinderGetServerSideProps;
