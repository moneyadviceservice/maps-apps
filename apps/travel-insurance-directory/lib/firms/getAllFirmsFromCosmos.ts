import { SortDir } from 'types/admin';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { paginateItems } from '@maps-react/utils/pagination';
import type { Pagination } from '@maps-react/utils/pagination';

import { dbConnect } from '../database/dbConnect';

export type AdminSearchParams = {
  principalName?: string | null;
  fcaNumber?: string | null;
  firmName?: string | null;
  sortBy?: string | null;
  sortDir?: SortDir;
};

export type GetAllFirmsResult = {
  firms: TravelInsuranceFirmDocument[];
  pagination: Pagination;
};

const VALID_SORT_FIELDS: Record<string, string> = {
  principalName: 'principals',
  fcaNumber: 'fca_number',
  firmName: 'registered_name',
  addedAt: 'created_at',
  approvedAt: 'approved_at',
  reregisteredAt: 'reregistered_at',
  reapprovedAt: 'reregister_approved_at',
};

function buildCosmosQuery(params: AdminSearchParams): {
  query: string;
  parameters: { name: string; value: string | number }[];
} {
  const conditions: string[] = [];
  const parameters: { name: string; value: string | number }[] = [];

  conditions.push(
    'IS_DEFINED(c.registered_name) AND c.registered_name != ""',
    'ARRAY_LENGTH(c.principals) > 0',
  );

  if (params.principalName?.trim()) {
    conditions.push(
      'EXISTS(SELECT VALUE p FROM p IN c.principals WHERE CONTAINS(LOWER(CONCAT(p.first_name, " ", p.last_name)), @principalName))',
    );
    parameters.push({
      name: '@principalName',
      value: params.principalName.trim().toLowerCase(),
    });
  }

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
    params.sortBy && VALID_SORT_FIELDS[params.sortBy]
      ? `c.${VALID_SORT_FIELDS[params.sortBy]}`
      : 'c.display_order';
  const sortDir = params.sortDir === 'desc' ? 'DESC' : 'ASC';

  const query = `SELECT * FROM c${where} ORDER BY ${sortField} ${sortDir}`;
  return { query, parameters };
}

export async function getAllFirmsFromCosmos(
  params: AdminSearchParams,
  page: number,
  limit: number,
): Promise<GetAllFirmsResult> {
  const { container } = await dbConnect();
  const { query, parameters } = buildCosmosQuery(params);

  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll();

  const allFirms = (resources ?? []) as TravelInsuranceFirmDocument[];
  const { items, pagination } = paginateItems(allFirms, { page, limit });

  return { firms: items, pagination };
}
