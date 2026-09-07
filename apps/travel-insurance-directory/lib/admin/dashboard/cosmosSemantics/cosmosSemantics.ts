/**
 * In-memory equivalents of admin firm list Cosmos {@link buildCosmosQuery} WHERE + ORDER BY,
 * so CI fixtures reuse the same semantics as production without duplicating rules in the fixture file.
 */

import type { AdminSearchParams } from 'lib/admin/dashboard/firmListPipeline';
import { isMainFirm, isTradingFirm } from 'lib/firms/firmDocument';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

/** Cosmos ORDER BY fields only (same map as SQL `c.<field>`). Firm name column sort is in-memory in {@link processAdminFirmListForPage}. */
export const ADMIN_COSMOS_VALID_SORT_FIELDS: Record<string, string> = {
  fcaNumber: 'fca_number',
  addedAt: 'created_at',
  approvedAt: 'approved_at',
  reregisteredAt: 'reregistered_at',
  reapprovedAt: 'reregister_approved_at',
};

type CosmosBackedSortColumn =
  | 'fca_number'
  | 'created_at'
  | 'approved_at'
  | 'reregistered_at'
  | 'reregister_approved_at';

function matchesAdminCosmosBaseWhere(
  firm: TravelInsuranceFirmDocument,
): boolean {
  const name = firm.registered_name;
  if (name === undefined || name === null || String(name).trim() === '') {
    return false;
  }
  if (isTradingFirm(firm)) {
    return true;
  }
  if (isMainFirm(firm)) {
    return firm.principal != null;
  }
  return false;
}

/** Mirrors every `WHERE` predicate from the admin Cosmos query (excluding in-memory principal filter). */
export function filterDocumentsMatchingAdminCosmosWhere(
  firms: TravelInsuranceFirmDocument[],
  params: AdminSearchParams,
): TravelInsuranceFirmDocument[] {
  const fca = params.fcaNumber?.trim();
  const firmName = params.firmName?.trim().toLowerCase();

  return firms.filter((f) => {
    if (!matchesAdminCosmosBaseWhere(f)) {
      return false;
    }
    if (fca && !String(f.fca_number).includes(fca)) {
      return false;
    }
    if (
      firmName &&
      !(f.registered_name ?? '').toLowerCase().includes(firmName)
    ) {
      return false;
    }
    return true;
  });
}

function getAdminCosmosOrderFieldAndDirection(params: AdminSearchParams): {
  field: CosmosBackedSortColumn;
  direction: 'asc' | 'desc';
} {
  const sortBy = params.sortBy;
  const field: CosmosBackedSortColumn =
    sortBy && ADMIN_COSMOS_VALID_SORT_FIELDS[sortBy]
      ? (ADMIN_COSMOS_VALID_SORT_FIELDS[sortBy] as CosmosBackedSortColumn)
      : 'created_at';

  const usesFallbackCreatedAt =
    !sortBy || !ADMIN_COSMOS_VALID_SORT_FIELDS[sortBy];

  let direction: 'asc' | 'desc';
  if (params.sortDir === 'desc') {
    direction = 'desc';
  } else if (params.sortDir === 'asc') {
    direction = 'asc';
  } else if (usesFallbackCreatedAt) {
    direction = 'desc';
  } else {
    direction = 'asc';
  }

  return { field, direction };
}

function getComparableFieldValue(
  firm: TravelInsuranceFirmDocument,
  field: CosmosBackedSortColumn,
): string | number | null | undefined {
  switch (field) {
    case 'fca_number':
      return firm.fca_number;
    case 'created_at':
      return firm.created_at;
    case 'approved_at':
      return firm.approved_at;
    case 'reregistered_at':
      return firm.type === 'main' ? firm.reregistered_at : null;
    case 'reregister_approved_at':
      return firm.type === 'main' ? firm.reregister_approved_at : null;
    default:
      return undefined;
  }
}

function compareFieldValues(
  a: TravelInsuranceFirmDocument,
  b: TravelInsuranceFirmDocument,
  field: CosmosBackedSortColumn,
): number {
  const va = getComparableFieldValue(a, field);
  const vb = getComparableFieldValue(b, field);
  if (field === 'fca_number') {
    return Number(va) - Number(vb);
  }
  if (
    field === 'created_at' ||
    field === 'approved_at' ||
    field === 'reregistered_at' ||
    field === 'reregister_approved_at'
  ) {
    const ta = va ? new Date(String(va)).getTime() : 0;
    const tb = vb ? new Date(String(vb)).getTime() : 0;
    return ta - tb;
  }
  return String(va ?? '').localeCompare(String(vb ?? ''));
}

/**
 * Same ordering as Cosmos `ORDER BY` for the admin list query (including default `created_at` DESC).
 * `sortBy=principalName` / `firmName` still use Cosmos fallback order here; column sorts are applied in {@link processAdminFirmListForPage}.
 */
export function orderDocumentsLikeAdminCosmosQuery(
  firms: TravelInsuranceFirmDocument[],
  params: AdminSearchParams,
): TravelInsuranceFirmDocument[] {
  const { field, direction } = getAdminCosmosOrderFieldAndDirection(params);
  const factor = direction === 'desc' ? -1 : 1;

  return [...firms]
    .map((firm, index) => ({ firm, index }))
    .sort((x, y) => {
      const cmp = compareFieldValues(x.firm, y.firm, field);
      if (cmp !== 0) return cmp * factor;
      return x.index - y.index;
    })
    .map(({ firm }) => firm);
}
