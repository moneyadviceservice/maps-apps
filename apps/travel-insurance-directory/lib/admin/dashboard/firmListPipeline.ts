import type { MainReregistrationDates } from 'lib/admin/shared/firmInheritance/firmInheritance';
import {
  buildMainApprovedAtByFcaNumber,
  buildMainPrincipalByFcaNumber,
  buildMainRegisteredNameByFcaNumber,
  buildMainReregistrationByFcaNumber,
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
  mainPrincipalByFca: Record<string, Principal>;
  mainRegisteredNameByFca: Record<string, string>;
  mainApprovedAtByFca: Record<string, string | null>;
  mainReregistrationByFca: Record<string, MainReregistrationDates>;
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
  mainPrincipalByFca: Map<number, Principal>,
): PrincipalNameKey {
  const principal = getPrincipalForAdmin(firm, mainPrincipalByFca);
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
  mainPrincipalByFca: Map<number, Principal>,
  dir: SortDir,
): TravelInsuranceFirmDocument[] {
  const factor = dir === 'desc' ? -1 : 1;

  return firms
    .map((firm, index) => ({ firm, index }))
    .sort((a, b) => {
      const ak = getBestPrincipalNameKey(a.firm, mainPrincipalByFca);
      const bk = getBestPrincipalNameKey(b.firm, mainPrincipalByFca);
      const cmp = comparePrincipalNameKeys(ak, bk);
      if (cmp !== 0) return cmp * factor;
      return a.index - b.index;
    })
    .map(({ firm }) => firm);
}

const FIRM_DISPLAY_SORT_LOCALE = 'en-GB';

function sortFirmsByFirmDisplayName(
  firms: TravelInsuranceFirmDocument[],
  mainRegisteredNameByFca: Map<number, string>,
  dir: SortDir,
): TravelInsuranceFirmDocument[] {
  const factor = dir === 'desc' ? -1 : 1;
  const collatorOpts = { sensitivity: 'base' as const, numeric: true as const };

  return firms
    .map((firm, index) => ({ firm, index }))
    .sort((a, b) => {
      const nameA = getFirmDisplayNameForAdmin(a.firm, mainRegisteredNameByFca);
      const nameB = getFirmDisplayNameForAdmin(b.firm, mainRegisteredNameByFca);
      const cmp = nameA.localeCompare(
        nameB,
        FIRM_DISPLAY_SORT_LOCALE,
        collatorOpts,
      );
      if (cmp !== 0) return cmp * factor;
      return a.index - b.index;
    })
    .map(({ firm }) => firm);
}

function filterFirmsByPrincipalName(
  firms: TravelInsuranceFirmDocument[],
  mainPrincipalByFca: Map<number, Principal>,
  principalName: string,
): TravelInsuranceFirmDocument[] {
  const tokens = tokenizeSearchInput(principalName);
  if (tokens.length === 0) return firms;

  return firms.filter((firm) =>
    principalMatchesSearch(
      getPrincipalForAdmin(firm, mainPrincipalByFca),
      tokens,
    ),
  );
}

function fcaNumberMapToRecord<T>(map: Map<number, T>): Record<string, T> {
  const record: Record<string, T> = {};
  for (const [fca, value] of map) {
    record[String(fca)] = value;
  }
  return record;
}

/** In-memory principal filter, optional sorts, pagination (Cosmos-backed callers pass pre-filtered rows). */
export function processAdminFirmListForPage(
  allFirms: TravelInsuranceFirmDocument[],
  params: AdminSearchParams,
  page: number,
  limit: number,
): GetAllFirmsResult {
  const mainPrincipalByFca = buildMainPrincipalByFcaNumber(allFirms);
  const mainRegisteredNameByFca = buildMainRegisteredNameByFcaNumber(allFirms);
  const mainApprovedAtByFca = buildMainApprovedAtByFcaNumber(allFirms);
  const mainReregistrationByFca = buildMainReregistrationByFcaNumber(allFirms);

  let working = allFirms;
  if (params.principalName?.trim()) {
    working = filterFirmsByPrincipalName(
      working,
      mainPrincipalByFca,
      params.principalName,
    );
  }

  let orderedFirms = working;
  if (params.sortBy === 'principalName') {
    orderedFirms = sortFirmsByBestPrincipalName(
      working,
      mainPrincipalByFca,
      params.sortDir ?? 'asc',
    );
  } else if (params.sortBy === 'firmName') {
    orderedFirms = sortFirmsByFirmDisplayName(
      working,
      mainRegisteredNameByFca,
      params.sortDir ?? 'asc',
    );
  }

  const { items, pagination } = paginateItems(orderedFirms, { page, limit });

  return {
    firms: items,
    pagination,
    mainPrincipalByFca: fcaNumberMapToRecord(mainPrincipalByFca),
    mainRegisteredNameByFca: fcaNumberMapToRecord(mainRegisteredNameByFca),
    mainApprovedAtByFca: fcaNumberMapToRecord(mainApprovedAtByFca),
    mainReregistrationByFca: fcaNumberMapToRecord(mainReregistrationByFca),
  };
}
