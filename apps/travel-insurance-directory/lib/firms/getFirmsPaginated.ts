/**
 * Fetches one page of firms. Prefers Redis (all-firms + in-memory filter + pagination);
 * falls back to Cosmos when Redis is unavailable or empty.
 */

import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { redisRestGet } from '@maps-react/redis/rest-client';
import { isCompressed, uncompress } from '@maps-react/utils/compress';
import type { Pagination } from '@maps-react/utils/pagination';

import type { QueryParams } from '../../utils/query/queryHelpers';
import { CACHE_CONFIG } from '../cache/cacheConfig';
import { dbConnect } from '../database/dbConnect';
import { filterFirmsInMemory } from './filterFirmsInMemory';
import {
  ensureFirmsCacheUpdated,
  refreshFirmsCacheIfNeeded,
} from './refreshFirmsCache';

const COSMOS_ALL_ACTIVE_QUERY = `SELECT * FROM c WHERE c.status = @status ORDER BY c.display_order ASC`;
const COSMOS_STATUS_ACTIVE = 'active';

export type GetFirmsPaginatedResult = {
  firms: TravelInsuranceFirmDocument[];
  pagination: Pagination;
};

async function getFilteredFirmsFromRedis(
  queryParams: QueryParams,
): Promise<TravelInsuranceFirmDocument[] | null> {
  await ensureFirmsCacheUpdated();
  let response = await redisRestGet(CACHE_CONFIG.ALL_FIRMS_KEY);
  if (!response.success || response.data?.value == null) {
    await refreshFirmsCacheIfNeeded();
    response = await redisRestGet(CACHE_CONFIG.ALL_FIRMS_KEY);
    if (!response.success || response.data?.value == null) return null;
  }
  try {
    const raw = response.data.value;
    const jsonString = isCompressed(raw) ? await uncompress(raw) : raw;
    const parsed = JSON.parse(jsonString);
    const allFirms = Array.isArray(parsed) ? parsed : [];
    return filterFirmsInMemory(allFirms, queryParams);
  } catch {
    return null;
  }
}

async function getFilteredFirmsFromCosmos(
  queryParams: QueryParams,
): Promise<TravelInsuranceFirmDocument[]> {
  const { container } = await dbConnect();
  const querySpec = {
    query: COSMOS_ALL_ACTIVE_QUERY,
    parameters: [{ name: '@status', value: COSMOS_STATUS_ACTIVE }],
  };
  const { resources } = await container.items.query(querySpec).fetchAll();
  const allFirms = (resources ?? []) as TravelInsuranceFirmDocument[];
  return filterFirmsInMemory(allFirms, queryParams);
}

async function getFilteredFirms(
  queryParams: QueryParams,
): Promise<TravelInsuranceFirmDocument[]> {
  try {
    const fromRedis = await getFilteredFirmsFromRedis(queryParams);
    if (fromRedis != null) return fromRedis;
  } catch (err) {
    console.warn('Redis path failed, falling back to Cosmos:', err);
  }
  return getFilteredFirmsFromCosmos(queryParams);
}

/**
 * Returns all firms matching the current filter (no pagination).
 * Use for exports (e.g. PDF).
 */
export async function getAllFilteredFirms(
  queryParams: QueryParams,
): Promise<TravelInsuranceFirmDocument[]> {
  return getFilteredFirms(queryParams);
}

function buildPaginatedResult(
  filtered: TravelInsuranceFirmDocument[],
  page: number,
  limit: number,
): GetFirmsPaginatedResult {
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const firms = filtered.slice(startIndex, endIndex);
  return {
    firms,
    pagination: {
      page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      startIndex,
      endIndex,
    },
  };
}

export async function getFirmsPaginated(
  queryParams: QueryParams,
  page: number,
  limit: number,
): Promise<GetFirmsPaginatedResult> {
  const filtered = await getFilteredFirms(queryParams);
  return buildPaginatedResult(filtered, page, limit);
}
