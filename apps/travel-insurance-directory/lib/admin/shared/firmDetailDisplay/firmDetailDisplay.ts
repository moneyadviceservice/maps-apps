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

/** Website for admin detail: contact.website first, then website_address; trading falls back to main. */
export function getWebsiteAddressForAdmin(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): string | null {
  const own = getContactWebsite(firm);
  if (own || isMainFirm(firm) || !mainFirm) return own;
  if (mainFirm.fca_number !== firm.fca_number) return own;
  return getContactWebsite(mainFirm);
}

/** Principal for admin firm detail: trading inherits from linked main document. */
export function getPrincipalForAdminDetail(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Principal | null {
  if (
    mainFirm &&
    isTradingFirm(firm) &&
    mainFirm.fca_number === firm.fca_number
  ) {
    return mainFirm.principal ?? null;
  }
  return getPrincipal(firm);
}

export function formatPrincipalName(principal: Principal | null): string {
  if (!principal) return '—';
  const name = `${principal.first_name ?? ''} ${
    principal.last_name ?? ''
  }`.trim();
  return name || '—';
}
