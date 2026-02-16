/**
 * Fetches one page of firms from Cosmos with filter + ORDER BY display_order + OFFSET/LIMIT.
 * Ensures display_order is up to date (checks expiry, runs update if needed) before fetching.
 */

import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import type { SqlQuerySpec } from '@azure/cosmos';

import type { Pagination } from '@maps-react/utils/pagination';

import { ensureDisplayOrderUpdated } from '../../scripts/updateDisplayOrder';
import type { QueryParams } from '../../utils/query/queryHelpers';
import { dbConnect } from '../database/dbConnect';
import {
  buildListingsCountQuery,
  buildListingsQuery,
} from './buildListingsQuery';

export type GetFirmsPaginatedResult = {
  firms: TravelInsuranceFirmDocument[];
  pagination: Pagination;
};

export async function getFirmsPaginated(
  queryParams: QueryParams,
  page: number,
  limit: number,
): Promise<GetFirmsPaginatedResult> {
  await ensureDisplayOrderUpdated();

  const { container } = await dbConnect();

  const querySpec: SqlQuerySpec = buildListingsQuery(
    { status: 'active' },
    page,
    limit,
  );
  const countQuerySpec: SqlQuerySpec = buildListingsCountQuery(queryParams);

  const [itemsResponse, countResponse] = await Promise.all([
    container.items.query(querySpec).fetchAll(),
    container.items.query(countQuerySpec).fetchAll(),
  ]);

  const firms = itemsResponse.resources as TravelInsuranceFirmDocument[];
  const totalItems = (countResponse.resources[0] as number) ?? 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  const pagination: Pagination = {
    page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex,
    endIndex,
  };

  return { firms, pagination };
}
