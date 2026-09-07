import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { dbConnect } from '../database/dbConnect';
import { getAdminDashboardCiFixtureResult } from 'lib/admin/dashboard/ciFixture/ciFixture';
import { ADMIN_COSMOS_VALID_SORT_FIELDS } from 'lib/admin/dashboard/cosmosSemantics/cosmosSemantics';
import {
  type AdminSearchParams,
  type GetAllFirmsResult,
  processAdminFirmListForPage,
} from 'lib/admin/dashboard/firmListPipeline';

export { processAdminFirmListForPage };
export type { AdminSearchParams, GetAllFirmsResult };

function buildCosmosQuery(params: AdminSearchParams): {
  query: string;
  parameters: { name: string; value: string | number }[];
} {
  const conditions: string[] = [];
  const parameters: { name: string; value: string | number }[] = [];

  conditions.push(
    'IS_DEFINED(c.registered_name) AND c.registered_name != ""',
    `(c.type = 'main' AND IS_DEFINED(c.principal) OR c.type = 'trading')`,
  );

  // Principal name is filtered in memory so trading rows can match via inherited main principal.

  if (params.fcaNumber?.trim()) {
    conditions.push('CONTAINS(ToString(c.fca_number), @fcaNumber)');
    parameters.push({ name: '@fcaNumber', value: params.fcaNumber.trim() });
  }

  if (params.firmName?.trim()) {
    conditions.push('CONTAINS(LOWER(c.registered_name), @firmName)');
    parameters.push({
      name: '@firmName',
      value: params.firmName.trim().toLowerCase(),
    });
  }

  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';

  const sortField =
    params.sortBy && ADMIN_COSMOS_VALID_SORT_FIELDS[params.sortBy]
      ? `c.${ADMIN_COSMOS_VALID_SORT_FIELDS[params.sortBy]}`
      : 'c.created_at';

  const usesFallbackCreatedAt =
    !params.sortBy || !ADMIN_COSMOS_VALID_SORT_FIELDS[params.sortBy];

  let sortDirSql: 'ASC' | 'DESC';
  if (params.sortDir === 'desc') {
    sortDirSql = 'DESC';
  } else if (params.sortDir === 'asc') {
    sortDirSql = 'ASC';
  } else if (usesFallbackCreatedAt) {
    sortDirSql = 'DESC';
  } else {
    sortDirSql = 'ASC';
  }

  const query = `SELECT * FROM c${where} ORDER BY ${sortField} ${sortDirSql}`;
  return { query, parameters };
}

export async function getAllFirmsFromCosmos(
  params: AdminSearchParams,
  page: number,
  limit: number,
): Promise<GetAllFirmsResult> {
  if (process.env.CI === 'true') {
    return getAdminDashboardCiFixtureResult(params, page, limit);
  }

  const { container } = await dbConnect();
  const { query, parameters } = buildCosmosQuery(params);

  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll();

  const allFirms = (resources ?? []) as TravelInsuranceFirmDocument[];

  return processAdminFirmListForPage(allFirms, params, page, limit);
}
