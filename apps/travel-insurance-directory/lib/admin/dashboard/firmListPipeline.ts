import { getDirectoryStatusLabel } from 'lib/account/dashboard/getDirectoryStatusLabel';
import type { MainReregistrationDates } from 'lib/admin/shared/firmInheritance/firmInheritance';
import {
  buildMainApprovedAtByFirmId,
  buildMainPrincipalByFirmId,
  buildMainRegisteredNameByFirmId,
  buildMainReregistrationByFirmId,
  getFirmDisplayNameForAdmin,
  getPrincipalForAdmin,
  principalMatchesSearch,
} from 'lib/admin/shared/firmInheritance/firmInheritance';
import { SortDir } from 'types/admin';
import type {
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

import type { Pagination } from '@maps-react/utils/pagination';
import { paginateItems } from '@maps-react/utils/pagination';

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
  mainPrincipalByFirmId: Record<string, Principal>;
  mainRegisteredNameByFirmId: Record<string, string>;
  mainApprovedAtByFirmId: Record<string, string | null>;
  mainReregistrationByFirmId: Record<string, MainReregistrationDates>;
};

function tokenizeSearchInput(input: string): string[] {
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function normalizeNamePart(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

type PrincipalNameKey = { first: string; last: string };

function comparePrincipalNameKeys(
  a: PrincipalNameKey,
  b: PrincipalNameKey,
): number {
  const firstCmp = a.first.localeCompare(b.first);
  if (firstCmp !== 0) return firstCmp;
  return a.last.localeCompare(b.last);
}

function getBestPrincipalNameKey(
  firm: TravelInsuranceFirmDocument,
  mainPrincipalByFirmId: Map<string, Principal>,
): PrincipalNameKey {
  const principal = getPrincipalForAdmin(firm, mainPrincipalByFirmId);
  if (!principal) {
    return { first: '', last: '' };
  }

  return {
    first: normalizeNamePart(principal.first_name),
    last: normalizeNamePart(principal.last_name),
  };
}

function sortFirmsByBestPrincipalName(
  firms: TravelInsuranceFirmDocument[],
  mainPrincipalByFirmId: Map<string, Principal>,
  dir: SortDir,
): TravelInsuranceFirmDocument[] {
  const factor = dir === 'desc' ? -1 : 1;

  return firms
    .map((firm, index) => ({ firm, index }))
    .sort((a, b) => {
      const ak = getBestPrincipalNameKey(a.firm, mainPrincipalByFirmId);
      const bk = getBestPrincipalNameKey(b.firm, mainPrincipalByFirmId);
      const cmp = comparePrincipalNameKeys(ak, bk);
      if (cmp !== 0) return cmp * factor;
      return a.index - b.index;
    })
    .map(({ firm }) => firm);
}

const FIRM_DISPLAY_SORT_LOCALE = 'en-GB';
const FIRM_DISPLAY_SORT_COLLATOR = {
  sensitivity: 'base' as const,
  numeric: true as const,
};

function sortFirmsByDirectoryStatusLabel(
  firms: TravelInsuranceFirmDocument[],
  dir: SortDir,
): TravelInsuranceFirmDocument[] {
  const factor = dir === 'desc' ? -1 : 1;

  return firms
    .map((firm, index) => ({ firm, index }))
    .sort((a, b) => {
      const cmp = getDirectoryStatusLabel(a.firm).localeCompare(
        getDirectoryStatusLabel(b.firm),
        FIRM_DISPLAY_SORT_LOCALE,
        FIRM_DISPLAY_SORT_COLLATOR,
      );
      if (cmp !== 0) return cmp * factor;
      return a.index - b.index;
    })
    .map(({ firm }) => firm);
}

function sortFirmsByFirmDisplayName(
  firms: TravelInsuranceFirmDocument[],
  mainRegisteredNameByFirmId: Map<string, string>,
  dir: SortDir,
): TravelInsuranceFirmDocument[] {
  const factor = dir === 'desc' ? -1 : 1;

  return firms
    .map((firm, index) => ({ firm, index }))
    .sort((a, b) => {
      const nameA = getFirmDisplayNameForAdmin(
        a.firm,
        mainRegisteredNameByFirmId,
      );
      const nameB = getFirmDisplayNameForAdmin(
        b.firm,
        mainRegisteredNameByFirmId,
      );
      const cmp = nameA.localeCompare(
        nameB,
        FIRM_DISPLAY_SORT_LOCALE,
        FIRM_DISPLAY_SORT_COLLATOR,
      );
      if (cmp !== 0) return cmp * factor;
      return a.index - b.index;
    })
    .map(({ firm }) => firm);
}

function filterFirmsByPrincipalName(
  firms: TravelInsuranceFirmDocument[],
  mainPrincipalByFirmId: Map<string, Principal>,
  principalName: string,
): TravelInsuranceFirmDocument[] {
  const tokens = tokenizeSearchInput(principalName);
  if (tokens.length === 0) return firms;

  return firms.filter((firm) =>
    principalMatchesSearch(
      getPrincipalForAdmin(firm, mainPrincipalByFirmId),
      tokens,
    ),
  );
}

function firmIdMapToRecord<T>(map: Map<string, T>): Record<string, T> {
  const record: Record<string, T> = {};
  for (const [firmId, value] of map) {
    record[firmId] = value;
  }
  return record;
}

/** In-memory principal filter, optional sorts, pagination (Cosmos-backed callers pass pre-filtered rows). */
export function processAdminFirmListForPage(
  allFirms: TravelInsuranceFirmDocument[],
  params: AdminSearchParams,
  page: number,
  limit: number,
  linkedMainFirms: TravelInsuranceFirmDocument[] = [],
): GetAllFirmsResult {
  const firmsForInheritance = [...allFirms, ...linkedMainFirms];
  const mainPrincipalByFirmId = buildMainPrincipalByFirmId(firmsForInheritance);
  const mainRegisteredNameByFirmId =
    buildMainRegisteredNameByFirmId(firmsForInheritance);
  const mainApprovedAtByFirmId =
    buildMainApprovedAtByFirmId(firmsForInheritance);
  const mainReregistrationByFirmId =
    buildMainReregistrationByFirmId(firmsForInheritance);

  let working = allFirms;
  if (params.principalName?.trim()) {
    working = filterFirmsByPrincipalName(
      working,
      mainPrincipalByFirmId,
      params.principalName,
    );
  }

  let orderedFirms = working;
  if (params.sortBy === 'principalName') {
    orderedFirms = sortFirmsByBestPrincipalName(
      working,
      mainPrincipalByFirmId,
      params.sortDir ?? 'asc',
    );
  } else if (params.sortBy === 'firmName') {
    orderedFirms = sortFirmsByFirmDisplayName(
      working,
      mainRegisteredNameByFirmId,
      params.sortDir ?? 'asc',
    );
  } else if (params.sortBy === 'status') {
    orderedFirms = sortFirmsByDirectoryStatusLabel(
      working,
      params.sortDir ?? 'asc',
    );
  }

  const { items, pagination } = paginateItems(orderedFirms, { page, limit });

  return {
    firms: items,
    pagination,
    mainPrincipalByFirmId: firmIdMapToRecord(mainPrincipalByFirmId),
    mainRegisteredNameByFirmId: firmIdMapToRecord(mainRegisteredNameByFirmId),
    mainApprovedAtByFirmId: firmIdMapToRecord(mainApprovedAtByFirmId),
    mainReregistrationByFirmId: firmIdMapToRecord(mainReregistrationByFirmId),
  };
}
