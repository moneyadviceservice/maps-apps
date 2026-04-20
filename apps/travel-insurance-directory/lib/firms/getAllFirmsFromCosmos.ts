import { SortDir } from 'types/admin';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import type { Pagination } from '@maps-react/utils/pagination';
import { paginateItems } from '@maps-react/utils/pagination';

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
  fcaNumber: 'fca_number',
  firmName: 'registered_name',
  addedAt: 'created_at',
  approvedAt: 'approved_at',
  reregisteredAt: 'reregistered_at',
  reapprovedAt: 'reregister_approved_at',
};

function tokenizeSearchInput(input: string): string[] {
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function buildCosmosQuery(params: AdminSearchParams): {
  query: string;
  parameters: { name: string; value: string | number }[];
} {
  const conditions: string[] = [];
  const parameters: { name: string; value: string | number }[] = [];

  conditions.push(
    'IS_DEFINED(c.registered_name) AND c.registered_name != ""',
    // Principal data can exist at the root (c.principals) or within trading_names (tn.principals)
    '(ARRAY_LENGTH(c.principals) > 0 OR (IS_DEFINED(c.trading_names) AND EXISTS(SELECT VALUE tn FROM tn IN c.trading_names WHERE ARRAY_LENGTH(tn.principals) > 0)))',
  );

  if (params.principalName?.trim()) {
    const tokens = tokenizeSearchInput(params.principalName);
    if (tokens.length > 0) {
      const tokenConds: string[] = [];
      tokens.forEach((token, idx) => {
        const paramName = `@principalToken${idx}`;
        tokenConds.push(
          `(EXISTS(SELECT VALUE p FROM p IN c.principals WHERE CONTAINS(LOWER(p.first_name), ${paramName}) OR CONTAINS(LOWER(p.last_name), ${paramName})) OR (IS_DEFINED(c.trading_names) AND EXISTS(SELECT VALUE tn FROM tn IN c.trading_names WHERE EXISTS(SELECT VALUE p FROM p IN tn.principals WHERE CONTAINS(LOWER(p.first_name), ${paramName}) OR CONTAINS(LOWER(p.last_name), ${paramName})))) )`,
        );
        parameters.push({ name: paramName, value: token });
      });
      conditions.push(`(${tokenConds.join(' OR ')})`);
    }
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

function getTradingNameKey(name: string | undefined | null): string | null {
  const n = typeof name === 'string' ? name.trim().toLowerCase() : '';
  return n || null;
}

function normalizeNamePart(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

type PrincipalNameKey = { first: string; last: string };

function comparePrincipalNameKeys(a: PrincipalNameKey, b: PrincipalNameKey): number {
  const firstCmp = a.first.localeCompare(b.first);
  if (firstCmp !== 0) return firstCmp;
  return a.last.localeCompare(b.last);
}

function getBestPrincipalNameKey(firm: TravelInsuranceFirmDocument): PrincipalNameKey {
  let best: PrincipalNameKey | null = null;

  for (const p of firm.principals ?? []) {
    const candidate = {
      first: normalizeNamePart(p?.first_name),
      last: normalizeNamePart(p?.last_name),
    };

    if (!best || comparePrincipalNameKeys(candidate, best) < 0) {
      best = candidate;
    }
  }

  return best ?? { first: '', last: '' };
}

function sortFirmsByBestPrincipalName(
  firms: TravelInsuranceFirmDocument[],
  dir: SortDir,
): TravelInsuranceFirmDocument[] {
  const factor = dir === 'desc' ? -1 : 1;

  return firms
    .map((firm, index) => ({ firm, index }))
    .sort((a, b) => {
      const ak = getBestPrincipalNameKey(a.firm);
      const bk = getBestPrincipalNameKey(b.firm);
      const cmp = comparePrincipalNameKeys(ak, bk);
      if (cmp !== 0) return cmp * factor;
      return a.index - b.index;
    })
    .map(({ firm }) => firm);
}

/**
 * If parent firms store their trading names nested in `trading_names[]`,
 * the trading names can also exist as top-level documents. To avoid showing
 * duplicates in admin results, drop any top-level document whose
 * `registered_name` matches a trading name declared by any other document.
 */
function dedupeTradingNameDocs(
  firms: TravelInsuranceFirmDocument[],
): TravelInsuranceFirmDocument[] {
  const declaredTradingNames = new Set<string>();

  for (const firm of firms) {
    for (const tn of firm.trading_names ?? []) {
      const k = getTradingNameKey(tn?.registered_name);
      if (k) declaredTradingNames.add(k);
    }
  }

  if (declaredTradingNames.size === 0) return firms;

  return firms.filter((firm) => {
    const firmNameKey = getTradingNameKey(firm.registered_name);
    if (!firmNameKey) return true;
    // Keep firms that are not trading-name docs declared elsewhere.
    return !declaredTradingNames.has(firmNameKey);
  });
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

  const allFirms = dedupeTradingNameDocs(
    (resources ?? []) as TravelInsuranceFirmDocument[],
  );
  const orderedFirms =
    params.sortBy === 'principalName'
      ? sortFirmsByBestPrincipalName(allFirms, params.sortDir ?? 'asc')
      : allFirms;

  const { items, pagination } = paginateItems(orderedFirms, { page, limit });

  return { firms: items, pagination };
}
