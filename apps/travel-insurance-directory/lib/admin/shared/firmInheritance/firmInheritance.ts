import { isMainFirm, isTradingFirm } from 'lib/firms/firmDocument';
import type {
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

/** Build fca_number → principal from main firm documents (for admin trading rows). */
export function buildMainPrincipalByFcaNumber(
  firms: TravelInsuranceFirmDocument[],
): Map<number, Principal> {
  const map = new Map<number, Principal>();
  for (const firm of firms) {
    if (!isMainFirm(firm) || !firm.principal) continue;
    if (!map.has(firm.fca_number)) {
      map.set(firm.fca_number, firm.principal);
    }
  }
  return map;
}

/** Build fca_number → main firm registered_name (for admin trading row labels). */
export function buildMainRegisteredNameByFcaNumber(
  firms: TravelInsuranceFirmDocument[],
): Map<number, string> {
  const map = new Map<number, string>();
  for (const firm of firms) {
    if (!isMainFirm(firm)) continue;
    const name = firm.registered_name?.trim();
    if (!name || map.has(firm.fca_number)) continue;
    map.set(firm.fca_number, name);
  }
  return map;
}

/** Admin label for a trading document linked to a main firm by fca_number. */
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
  mainRegisteredNameByFca: Map<number, string>,
): string {
  if (!isTradingFirm(firm)) {
    return firm.registered_name?.trim() || '—';
  }
  return formatTradingFirmDisplayName(
    firm.registered_name ?? '',
    mainRegisteredNameByFca.get(firm.fca_number),
  );
}

export type MainReregistrationDates = {
  reregistered_at: string | null;
  reregister_approved_at: string | null;
};

/** Build fca_number → main re-registration dates (for admin trading rows). */
export function buildMainReregistrationByFcaNumber(
  firms: TravelInsuranceFirmDocument[],
): Map<number, MainReregistrationDates> {
  const map = new Map<number, MainReregistrationDates>();
  for (const firm of firms) {
    if (!isMainFirm(firm) || map.has(firm.fca_number)) continue;
    map.set(firm.fca_number, {
      reregistered_at: firm.reregistered_at ?? null,
      reregister_approved_at: firm.reregister_approved_at ?? null,
    });
  }
  return map;
}

/** Build fca_number → main firm approved_at (for admin trading rows). */
export function buildMainApprovedAtByFcaNumber(
  firms: TravelInsuranceFirmDocument[],
): Map<number, string | null> {
  const map = new Map<number, string | null>();
  for (const firm of firms) {
    if (!isMainFirm(firm) || map.has(firm.fca_number)) continue;
    map.set(firm.fca_number, firm.approved_at ?? null);
  }
  return map;
}

export function getApprovedAtForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainApprovedAtByFca: Map<number, string | null>,
): string | null {
  if (isMainFirm(firm)) {
    return firm.approved_at ?? null;
  }
  return mainApprovedAtByFca.get(firm.fca_number) ?? null;
}

export function getReregisteredAtForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainReregistrationByFca: Map<number, MainReregistrationDates>,
): string | null {
  if (isMainFirm(firm)) {
    return firm.reregistered_at ?? null;
  }
  return mainReregistrationByFca.get(firm.fca_number)?.reregistered_at ?? null;
}

export function getReregisterApprovedAtForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainReregistrationByFca: Map<number, MainReregistrationDates>,
): string | null {
  if (isMainFirm(firm)) {
    return firm.reregister_approved_at ?? null;
  }
  return (
    mainReregistrationByFca.get(firm.fca_number)?.reregister_approved_at ?? null
  );
}

/** Principal for admin display: main uses own; trading inherits from main by fca_number. */
export function getPrincipalForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainPrincipalByFca: Map<number, Principal>,
): Principal | null {
  if (isMainFirm(firm)) {
    return firm.principal ?? null;
  }
  return mainPrincipalByFca.get(firm.fca_number) ?? null;
}

function normalizePrincipalPart(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

/** True if any token matches first or last name (OR across tokens). */
export function principalMatchesSearch(
  principal: Principal | null,
  tokens: string[],
): boolean {
  if (!principal || tokens.length === 0) return false;
  const first = normalizePrincipalPart(principal.first_name);
  const last = normalizePrincipalPart(principal.last_name);
  return tokens.some((token) => first.includes(token) || last.includes(token));
}

/** Admin helper: whether firm is main (has principal) or trading-only row. */
export function firmDocumentKindLabel(
  firm: TravelInsuranceFirmDocument,
): string {
  return isMainFirm(firm) ? 'Main' : 'Trading';
}
