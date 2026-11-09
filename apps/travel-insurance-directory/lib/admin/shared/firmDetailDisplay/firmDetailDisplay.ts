import {
  getPrincipal,
  isMainFirm,
  isTradingFirm,
} from 'lib/firms/firmDocument';
import type {
  MainTravelInsuranceFirmDocument,
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

function getContactWebsite(firm: TravelInsuranceFirmDocument): string | null {
  const fromContact = firm.office?.contact?.website?.trim();
  if (fromContact) return fromContact;
  const fromTopLevel = firm.website_address?.trim();
  return fromTopLevel || null;
}

function linkedMainFirm(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): MainTravelInsuranceFirmDocument | null {
  if (!mainFirm || !isTradingFirm(firm)) return null;
  const mainId = mainFirm.id?.trim();
  const linkedId = firm.main_firm_id?.trim();
  if (!mainId || !linkedId || mainId !== linkedId) return null;
  return mainFirm;
}

/** Website for admin detail: contact.website first, then website_address; trading falls back to its main firm. */
export function getWebsiteAddressForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): string | null {
  const own = getContactWebsite(firm);
  if (own || isMainFirm(firm)) return own;
  const linked = linkedMainFirm(firm, mainFirm);
  return linked ? getContactWebsite(linked) : own;
}

/** Principal for admin firm detail: trading inherits from the main firm referenced by main_firm_id. */
export function getPrincipalForAdminDetail(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Principal | null {
  const linked = linkedMainFirm(firm, mainFirm);
  if (linked) return linked.principal ?? null;
  return getPrincipal(firm);
}

export function formatPrincipalName(principal: Principal | null): string {
  if (!principal) return '—';
  const name = `${principal.first_name ?? ''} ${
    principal.last_name ?? ''
  }`.trim();
  return name || '—';
}
