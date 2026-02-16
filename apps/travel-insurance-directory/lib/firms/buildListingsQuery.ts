/**
 * Builds Cosmos SQL + parameters for listings: filter + ORDER BY display_order + OFFSET/LIMIT.
 * Used so pagination and order are done in Cosmos (after hourly job sets display_order).
 */

import type { QueryParams } from 'utils/query/queryHelpers';
import type { SqlParameter } from '@azure/cosmos';

export type ListingsQuerySpec = {
  query: string;
  parameters: SqlParameter[];
};

const STATUS_ACTIVE = 'active';

/**
 * Build WHERE conditions and parameters from query params (all filters in Cosmos).
 */
export function buildListingsQuery(
  queryParams: QueryParams,
  page: number,
  limit: number,
): ListingsQuerySpec {
  const offset = (page - 1) * limit;

  const parameters: SqlParameter[] = [
    { name: '@status', value: STATUS_ACTIVE },
    { name: '@offset', value: offset },
    { name: '@limit', value: limit },
  ];

  const query = `SELECT * FROM c WHERE c.status = @status ORDER BY c.display_order ASC OFFSET @offset LIMIT @limit`;

  return { query, parameters };
}

/**
 * Build COUNT query (same WHERE, no ORDER BY / OFFSET / LIMIT) for totalItems.
 */
export function buildListingsCountQuery(
  queryParams: QueryParams,
): ListingsQuerySpec {
  const conditions = ['c.status = @status'];

  const parameters: SqlParameter[] = [
    { name: '@status', value: STATUS_ACTIVE },
  ];

  const whereClause = conditions.join(' AND ');
  const query = `SELECT VALUE COUNT(1) FROM c WHERE ${whereClause}`;

  return { query, parameters };
}
