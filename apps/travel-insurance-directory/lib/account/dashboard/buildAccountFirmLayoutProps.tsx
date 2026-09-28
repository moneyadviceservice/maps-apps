import { AccountRegistrationCallout } from 'components/Account/AccountRegistrationCallout';
import { accountFirmRowLabels } from 'data/pages/account/tradingNames';
import type { FirmLayoutProps } from 'layouts/FirmLayout';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import {
  coverAndServiceAccountHref,
  customerContactAccountHref,
  getFirmSectionStatuses,
} from './firmSectionStatus';
import { getDirectoryStatusLabel } from './getDirectoryStatusLabel';

const accountIntroParagraphs = [
  {
    id: 'intro-1',
    content: (
      <>
        You can enter details for one firm. This can be the main authorised firm{' '}
        <strong>OR</strong> one trading name.{' '}
        <strong>
          Only firms that specialise in providing travel insurance to people
          with serious pre-existing medical conditions should be added.
        </strong>
      </>
    ),
  },
  {
    id: 'intro-2',
    content: (
      <>
        The sections <strong>Cover &amp; Service</strong> and{' '}
        <strong>Customer Contact Details</strong> must be completed before your
        firm can be approved and visible on the Directory.
      </>
    ),
  },
] as const satisfies FirmLayoutProps['introParagraphs'];

export function buildAccountFirmLayoutProps({
  firm,
  showReregistrationBanner,
  showRegistrationResumeCallout,
  registrationIncomplete,
  resumeRegistrationHref,
  hasRenewalDraft,
  reregistrationExpirationLabel,
  reregistrationCtaHref,
}: {
  firm: MainTravelInsuranceFirmDocument;
  showReregistrationBanner?: boolean;
  showRegistrationResumeCallout: boolean;
  registrationIncomplete: boolean;
  resumeRegistrationHref: string;
  hasRenewalDraft?: boolean;
  reregistrationExpirationLabel?: string | null;
  reregistrationCtaHref?: string;
}): FirmLayoutProps {
  const calloutSections = [];

  if (showReregistrationBanner) {
    calloutSections.push(
      <AccountRegistrationCallout
        key="reregistration"
        variant={hasRenewalDraft ? 'reregistration_resume' : 'reregistration'}
        href={reregistrationCtaHref ?? resumeRegistrationHref}
        expirationDateLabel={reregistrationExpirationLabel ?? undefined}
      />,
    );
  }

  if (showRegistrationResumeCallout) {
    calloutSections.push(
      <AccountRegistrationCallout
        key="registration-resume"
        variant={
          registrationIncomplete
            ? 'registration_incomplete'
            : 'registration_not_approved'
        }
        href={resumeRegistrationHref}
      />,
    );
  }

  const callout =
    calloutSections.length > 0 ? (
      <div className="space-y-6">{calloutSections}</div>
    ) : undefined;

  const sectionStatuses = getFirmSectionStatuses(firm);

  return {
    pageHeading: 'Register your firm',
    callout,
    introParagraphs: accountIntroParagraphs,
    mainAuthorisedFirmHeading: 'Main authorised firm',
    mainAuthorisedFirm: {
      registeredName: firm.registered_name ?? '',
      frn: String(firm.fca_number ?? ''),
      directoryStatusLabel: getDirectoryStatusLabel(firm),
      coverAndService: {
        changeHref: coverAndServiceAccountHref(firm.id, firm),
        sectionStatus: sectionStatuses.coverAndService,
      },
      customerContactDetails: {
        changeHref: customerContactAccountHref(firm.id, firm),
        sectionStatus: sectionStatuses.customerContactDetails,
      },
    },
    firmBlockRowLabels: accountFirmRowLabels,
  };
}
