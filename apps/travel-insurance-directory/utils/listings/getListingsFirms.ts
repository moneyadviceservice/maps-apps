import { getFirmsPaginated } from 'lib/firms/getFirmsPaginated';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import type { QueryParams } from 'utils/query/queryHelpers';

import {
  extractPaginationParams,
  type Pagination,
} from '@maps-react/utils/pagination';

export type GetListingsFirmsResult = {
  firms: TravelInsuranceFirmDocument[];
  pagination: Pagination;
};

const DEFAULT_ITEMS_PER_PAGE = 5;

/**
 * Fetches one page of firms from Cosmos: all query params are applied as filters,
 * results are ordered by display_order and paginated in the DB.
 */
export async function getListingsFirms(
  queryParams: QueryParams,
  defaultItemsPerPage: number = DEFAULT_ITEMS_PER_PAGE,
): Promise<GetListingsFirmsResult> {
  const { page, limit } = extractPaginationParams(queryParams, {
    defaultLimit: defaultItemsPerPage,
  });
  return getFirmsPaginated(queryParams, page, limit);
}
