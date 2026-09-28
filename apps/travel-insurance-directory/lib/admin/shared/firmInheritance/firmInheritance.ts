import { isMainFirm, isTradingFirm } from 'lib/firms/firmDocument';
import type {
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

function documentId(id: string | null | undefined): string | null {
  const trimmed = id?.trim();
  return trimmed || null;
}

/** Trading documents store the parent main firm id. Shared test FCAs are not a join key. */
function tradingMainFirmId(firm: TravelInsuranceFirmDocument): string | null {
  if (!isTradingFirm(firm)) return null;
  return documentId(firm.main_firm_id);
}

/** Main firm ids referenced by trading rows that are not already in the list. */
export function collectMissingMainFirmIds(
  firms: TravelInsuranceFirmDocument[],
): string[] {
  const present = new Set<string>();
  for (const firm of firms) {
    const id = documentId(firm.id);
    if (isMainFirm(firm) && id) present.add(id);
  }

  const missing = new Set<string>();
  for (const firm of firms) {
    const mainId = tradingMainFirmId(firm);
    if (mainId && !present.has(mainId)) missing.add(mainId);
  }
  return [...missing];
}

/** Build main firm id → principal (for admin trading rows). */
export function buildMainPrincipalByFirmId(
  firms: TravelInsuranceFirmDocument[],
): Map<string, Principal> {
  const map = new Map<string, Principal>();
  for (const firm of firms) {
    const id = documentId(firm.id);
    if (!isMainFirm(firm) || !firm.principal || !id || map.has(id)) continue;
    map.set(id, firm.principal);
  }
  return map;
}

/** Build main firm id → registered_name (for admin trading row labels). */
export function buildMainRegisteredNameByFirmId(
  firms: TravelInsuranceFirmDocument[],
): Map<string, string> {
  const map = new Map<string, string>();
  for (const firm of firms) {
    const id = documentId(firm.id);
    if (!isMainFirm(firm) || !id || map.has(id)) continue;
    const name = firm.registered_name?.trim();
    if (!name) continue;
    map.set(id, name);
  }
  return map;
}

/** Admin label for a trading document linked to a main firm by main_firm_id. */
export function formatTradingFirmDisplayName(
  tradingName: string,
  mainRegisteredName: string | null | undefined,
): string {
  const name = tradingName.trim() || '—';
  const main = mainRegisteredName?.trim();
  if (!main) return name;
  return `${name} subsidiary of ${main}`;
}

export function getFirmDisplayNameForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainRegisteredNameByFirmId: Map<string, string>,
): string {
  if (!isTradingFirm(firm)) {
    return firm.registered_name?.trim() || '—';
  }
  const mainId = tradingMainFirmId(firm);
  return formatTradingFirmDisplayName(
    firm.registered_name ?? '',
    mainId ? mainRegisteredNameByFirmId.get(mainId) : undefined,
  );
}

export type MainReregistrationDates = {
  reregistered_at: string | null;
  reregister_approved_at: string | null;
};

/** Build main firm id → re-registration dates (for admin trading rows). */
export function buildMainReregistrationByFirmId(
  firms: TravelInsuranceFirmDocument[],
): Map<string, MainReregistrationDates> {
  const map = new Map<string, MainReregistrationDates>();
  for (const firm of firms) {
    const id = documentId(firm.id);
    if (!isMainFirm(firm) || !id || map.has(id)) continue;
    map.set(id, {
      reregistered_at: firm.reregistered_at ?? null,
      reregister_approved_at: firm.reregister_approved_at ?? null,
    });
  }
  return map;
}

/** Build main firm id → approved_at (for admin trading rows). */
export function buildMainApprovedAtByFirmId(
  firms: TravelInsuranceFirmDocument[],
): Map<string, string | null> {
  const map = new Map<string, string | null>();
  for (const firm of firms) {
    const id = documentId(firm.id);
    if (!isMainFirm(firm) || !id || map.has(id)) continue;
    map.set(id, firm.approved_at ?? null);
  }
  return map;
}

export function getApprovedAtForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainApprovedAtByFirmId: Map<string, string | null>,
): string | null {
  if (isMainFirm(firm)) {
    return firm.approved_at ?? null;
  }
  const mainId = tradingMainFirmId(firm);
  return mainId ? mainApprovedAtByFirmId.get(mainId) ?? null : null;
}

export function getReregisteredAtForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainReregistrationByFirmId: Map<string, MainReregistrationDates>,
): string | null {
  if (isMainFirm(firm)) {
    return firm.reregistered_at ?? null;
  }
  const mainId = tradingMainFirmId(firm);
  return mainId
    ? mainReregistrationByFirmId.get(mainId)?.reregistered_at ?? null
    : null;
}

export function getReregisterApprovedAtForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainReregistrationByFirmId: Map<string, MainReregistrationDates>,
): string | null {
  if (isMainFirm(firm)) {
    return firm.reregister_approved_at ?? null;
  }
  const mainId = tradingMainFirmId(firm);
  return mainId
    ? mainReregistrationByFirmId.get(mainId)?.reregister_approved_at ?? null
    : null;
}

/** Principal for admin display: main uses its own; trading uses the main firm referenced by main_firm_id. */
export function getPrincipalForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainPrincipalByFirmId: Map<string, Principal>,
): Principal | null {
  if (isMainFirm(firm)) {
    return firm.principal ?? null;
  }
  const mainId = tradingMainFirmId(firm);
  return mainId ? mainPrincipalByFirmId.get(mainId) ?? null : null;
}

function normalizePrincipalPart(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

/** True if any token matches first name, last name, or email (OR across tokens). */
export function principalMatchesSearch(
  principal: Principal | null,
  tokens: string[],
): boolean {
  if (!principal || tokens.length === 0) return false;
  const first = normalizePrincipalPart(principal.first_name);
  const last = normalizePrincipalPart(principal.last_name);
  const email = normalizePrincipalPart(principal.email_address);
  return tokens.some(
    (token) =>
      first.includes(token) ||
      last.includes(token) ||
      (email !== '' && email.includes(token)),
  );
}

/** Admin helper: whether firm is main (has principal) or trading-only row. */
export function firmDocumentKindLabel(
  firm: TravelInsuranceFirmDocument,
): string {
  return isMainFirm(firm) ? 'Main' : 'Trading';
}
