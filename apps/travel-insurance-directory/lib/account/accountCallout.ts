import type { IronSessionData } from 'iron-session';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import {
  getRegistrationFlowEntryHref,
  isRegistrationIncomplete,
  shouldShowRegistrationResumeCallout,
} from './registrationCompletion';
import {
  getRegistrationAnniversary,
  hasActivePendingReregistration,
  isInRenewalWindow,
} from './reregistrationState';

export type AccountCalloutState = {
  showReregistrationBanner: boolean;
  showRegistrationResumeCallout: boolean;
  registrationIncomplete: boolean;
  resumeRegistrationHref: string;
  /** True when a renewal draft exists (Resume CTA). */
  hasRenewalDraft: boolean;
  /** Formatted final expiration date for the renewal banner, if available. */
  reregistrationExpirationLabel: string | null;
  /**
   * Always a `/register/*` path — same journey as first registration.
   * Draft capture starts when that URL is loaded.
   */
  reregistrationCtaHref: string;
};

function formatExpirationDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getAccountCalloutState(
  session: Pick<IronSessionData, 'savedProgressLink'>,
  firm: MainTravelInsuranceFirmDocument,
  now: Date = new Date(),
): AccountCalloutState {
  const hasRenewalDraft = firm.renewal_draft != null;
  const inRenewalWindow = isInRenewalWindow(firm, now);
  const showReregistrationBanner =
    inRenewalWindow || hasActivePendingReregistration(firm);
  const anniversary = getRegistrationAnniversary(firm);
  const resumeRegistrationHref = getRegistrationFlowEntryHref(
    session,
    firm,
    now,
  );

  return {
    showReregistrationBanner,
    showRegistrationResumeCallout: shouldShowRegistrationResumeCallout(firm),
    registrationIncomplete: isRegistrationIncomplete(firm),
    resumeRegistrationHref,
    hasRenewalDraft,
    reregistrationExpirationLabel:
      inRenewalWindow && anniversary
        ? formatExpirationDate(anniversary)
        : null,
    // Same register URLs as first-time; only draft write-target differs.
    reregistrationCtaHref: resumeRegistrationHref,
  };
}
