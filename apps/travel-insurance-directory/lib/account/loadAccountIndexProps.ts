import { getAccountCalloutState } from 'lib/account/accountCallout';
import { resolveAccountMainFirm } from 'lib/account/resolveAccountMainFirm';
import { fetchTradingDocsByMainFirmId } from 'lib/account/tradingFirm';
import { fetchTradingNamesForFirmFcaNumber } from 'lib/fca/fetchTradingNamesForFirm';
import { syncRegistrationSessionFromFirm } from 'lib/register/syncRegistrationSessionFromFirm';
import type { IronSessionData } from 'iron-session';
import type {
  MainTravelInsuranceFirmDocument,
  TradingTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type AccountIndexPageProps =
  | {
      firmNotFound: true;
      lang: 'en' | 'cy';
    }
  | {
      firmNotFound?: false;
      lang: 'en' | 'cy';
      firm: MainTravelInsuranceFirmDocument;
      tradingFirms: TradingTravelInsuranceFirmDocument[];
      showRegistrationResumeCallout: boolean;
      registrationIncomplete: boolean;
      resumeRegistrationHref: string;
      showReregistrationBanner: boolean;
      hasRenewalDraft: boolean;
      reregistrationExpirationLabel: string | null;
      reregistrationCtaHref: string;
      availableTradingNames: string[];
      initialAvailableTradingNameSearch: string | null;
    };

type LoadAccountIndexPropsInput = {
  session: IronSessionData & { save: () => Promise<void> };
  lang: 'en' | 'cy';
  initialAvailableTradingNameSearch?: string;
};

/**
 * Shared GSSP loader for /account. Resolves the firm, syncs registration
 * session fields from Cosmos when needed, and returns either page props or a
 * `firmNotFound` state instead of a 404.
 */
export async function loadAccountIndexProps({
  session,
  lang,
  initialAvailableTradingNameSearch,
}: LoadAccountIndexPropsInput): Promise<AccountIndexPageProps> {
  const { firm } = await resolveAccountMainFirm(session);

  if (!firm) {
    return { firmNotFound: true, lang };
  }

  if (syncRegistrationSessionFromFirm(session, firm)) {
    await session.save();
  }

  const {
    showReregistrationBanner,
    showRegistrationResumeCallout,
    registrationIncomplete,
    resumeRegistrationHref,
    hasRenewalDraft,
    reregistrationExpirationLabel,
    reregistrationCtaHref,
  } = getAccountCalloutState(session, firm);

  const tradingResult = await fetchTradingDocsByMainFirmId(firm.id);
  const tradingFirms = tradingResult.response ?? [];

  let availableTradingNames: string[] = [];
  const namesResult = await fetchTradingNamesForFirmFcaNumber(firm.fca_number);
  if (namesResult.ok) {
    availableTradingNames = namesResult.names;
  }

  return {
    lang,
    firm,
    tradingFirms,
    showRegistrationResumeCallout,
    registrationIncomplete,
    resumeRegistrationHref,
    showReregistrationBanner,
    hasRenewalDraft,
    reregistrationExpirationLabel,
    reregistrationCtaHref,
    availableTradingNames,
    initialAvailableTradingNameSearch:
      initialAvailableTradingNameSearch ?? null,
  };
}
